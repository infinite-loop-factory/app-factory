import { type ExpoWebGLRenderingContext, GLView } from "expo-gl";
import { useEffect, useRef } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import * as THREE from "three";
import { createGlRenderer } from "@/components/dice/dice-mesh";

type ConfettiBurstGlProps = {
  active: boolean;
  colors: string[];
};

type Particle = {
  ox: number;
  oy: number;
  vx: number;
  vy: number;
  spinSpeed: number;
  flutterSpeed: number;
  swayFreq: number;
  swayPhase: number;
  width: number;
  height: number;
  delay: number;
  // live integration state
  spawned: boolean;
  x: number;
  y: number;
  liveVx: number;
  liveVy: number;
};

// Two side cannons fire three volleys each toward the upper center. GPU
// instancing renders all pieces as one draw call, so the count is cheap.
const PER_VOLLEY = 80;
const VOLLEY_DELAYS_S = [0, 0.28, 0.56, 0.95];
const GRAVITY = 1150;
// Paper hits terminal velocity quickly, so pieces flutter down slowly
// instead of plummeting offscreen right after the apex.
const TERMINAL_VY = 150;
const HORIZONTAL_DRAG = 1.4;
const SWAY_PX = 16;
const FLIGHT_S = 4.6;
const SHRINK_FROM = 0.82;
const TOTAL_S =
  (VOLLEY_DELAYS_S[VOLLEY_DELAYS_S.length - 1] ?? 0) + FLIGHT_S + 0.2;

function buildParticles(width: number, height: number): Particle[] {
  const specs: Particle[] = [];
  for (const side of [-1, 1] as const) {
    const ox = side === -1 ? -width * 0.02 : width * 1.02;
    const oy = height * 0.86;
    for (const volleyDelay of VOLLEY_DELAYS_S) {
      for (let k = 0; k < PER_VOLLEY; k++) {
        // Aim at a jittered point in the upper center; solve the launch
        // velocity that reaches it at tPeak under gravity.
        const targetX = width * (0.5 + (Math.random() - 0.5) * 0.55);
        const targetY = height * (0.12 + Math.random() * 0.26);
        const tPeak = 0.5 + Math.random() * 0.22;
        const jitter = 0.8 + Math.random() * 0.35;
        specs.push({
          ox,
          oy,
          vx: ((targetX - ox) / tPeak) * jitter,
          vy: ((targetY - oy) / tPeak - 0.5 * GRAVITY * tPeak) * jitter,
          spinSpeed: (Math.random() - 0.5) * 16,
          flutterSpeed: (Math.random() - 0.5) * 14,
          swayFreq: 2.2 + Math.random() * 2.4,
          swayPhase: Math.random() * Math.PI * 2,
          width: 7 + Math.random() * 7,
          height: 12 + Math.random() * 8,
          delay: volleyDelay + Math.random() * 0.09,
          spawned: false,
          x: 0,
          y: 0,
          liveVx: 0,
          liveVy: 0,
        });
      }
    }
  }
  return specs;
}

function resolvePieceScale(local: number): number {
  if (local <= 0 || local >= FLIGHT_S) return 0;
  const k = local / FLIGHT_S;
  return k > SHRINK_FROM ? 1 - (k - SHRINK_FROM) / (1 - SHRINK_FROM) : 1;
}

function advanceParticle(p: Particle, dt: number): void {
  if (!p.spawned) {
    p.spawned = true;
    p.x = p.ox;
    p.y = p.oy;
    p.liveVx = p.vx;
    p.liveVy = p.vy;
  }
  p.liveVy = Math.min(p.liveVy + GRAVITY * dt, TERMINAL_VY);
  p.liveVx *= Math.exp(-HORIZONTAL_DRAG * dt);
  p.x += p.liveVx * dt;
  p.y += p.liveVy * dt;
}

export function ConfettiBurstGl({ active, colors }: ConfettiBurstGlProps) {
  const { width, height } = useWindowDimensions();
  const rafRef = useRef<number | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(
    () => () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      cleanupRef.current?.();
    },
    [],
  );

  if (!active) return null;

  const onContextCreate = (gl: ExpoWebGLRenderingContext) => {
    const renderer = createGlRenderer(gl);
    const scene = new THREE.Scene();
    // Screen-pixel ortho camera, y pointing down.
    const camera = new THREE.OrthographicCamera(0, width, 0, height, -100, 100);
    camera.position.z = 10;

    const particles = buildParticles(width, height);
    const geometry = new THREE.PlaneGeometry(1, 1);
    const material = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide });
    const mesh = new THREE.InstancedMesh(geometry, material, particles.length);
    // The base 1x1 plane's bounding sphere knows nothing about instance
    // transforms, so the whole mesh gets frustum-culled without this.
    mesh.frustumCulled = false;
    const tint = new THREE.Color();
    particles.forEach((_, i) => {
      mesh.setColorAt(i, tint.set(colors[i % colors.length] ?? "#c9a227"));
    });
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    scene.add(mesh);

    const dummy = new THREE.Object3D();
    const start = Date.now();
    let lastNow = start;

    const renderFrame = () => {
      const now = Date.now();
      const t = (now - start) / 1000;
      const dt = Math.min(0.05, (now - lastNow) / 1000);
      lastNow = now;
      particles.forEach((p, i) => {
        const local = t - p.delay;
        const scale = resolvePieceScale(local);
        if (scale === 0) {
          dummy.position.set(0, -100, 0);
          dummy.rotation.set(0, 0, 0);
          dummy.scale.set(0.0001, 0.0001, 1);
        } else {
          advanceParticle(p, dt);
          const sway =
            Math.sin(local * p.swayFreq + p.swayPhase) *
            SWAY_PX *
            Math.min(1, local);
          dummy.position.set(p.x + sway, p.y, 0);
          dummy.rotation.set(p.flutterSpeed * local, 0, p.spinSpeed * local);
          dummy.scale.set(p.width * scale, p.height * scale, 1);
        }
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      });
      mesh.instanceMatrix.needsUpdate = true;
      renderer.render(scene, camera);
      gl.endFrameEXP();
      if (t < TOTAL_S) {
        rafRef.current = requestAnimationFrame(renderFrame);
      } else {
        rafRef.current = null;
      }
    };
    rafRef.current = requestAnimationFrame(renderFrame);

    cleanupRef.current = () => {
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  };

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <GLView onContextCreate={onContextCreate} style={styles.gl} />
    </View>
  );
}

const styles = StyleSheet.create({
  gl: {
    flex: 1,
    backgroundColor: "transparent",
  },
});
