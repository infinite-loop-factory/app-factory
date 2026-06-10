/**
 * biome-ignore-all lint/complexity/noExcessiveCognitiveComplexity: scripted
 * physics loop — bounce/settle phases live in one frame callback
 */

import type { DiceVariant } from "@/components/dice/dice-variant";

import { type ExpoWebGLRenderingContext, GLView } from "expo-gl";
import { useEffect, useRef } from "react";
import { View } from "react-native";
import * as THREE from "three";
import {
  buildDie,
  createGlRenderer,
  faceQuaternion,
} from "@/components/dice/dice-mesh";
import {
  type DiceFaceValue,
  FACE_ROTATIONS,
} from "@/components/dice/dice-orientations";
import { rollDie } from "@/game/lib/game-helpers";

const GRAVITY = -26;
const REST_Y = -0.62;
const RESTITUTION = 0.52;
const SETTLE_MS = 420;
const MAX_PARTICLES = 26;

type DiceRollGlProps = {
  width: number;
  height: number;
  /** Tumble window before the die is allowed to settle. */
  durationMs: number;
  variant?: DiceVariant;
  /** Throw power 0..1 — scales launch velocity, spin, and tumble length. */
  charge?: number;
  /** Land on this face (gold dice); otherwise a fair roll is generated. */
  forcedValue?: number | null;
  /** Fired on each floor bounce with strength 0..1 — drive screen shake. */
  onImpact?: (strength: number) => void;
  onRollComplete: (value: number) => void;
};

type Particle = {
  mesh: THREE.Mesh;
  material: THREE.MeshBasicMaterial;
  velocity: THREE.Vector3;
  life: number;
};

function toFace(value: number | null | undefined): DiceFaceValue {
  if (value && value >= 1 && value <= 6) return value as DiceFaceValue;
  return rollDie() as DiceFaceValue;
}

function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3;
}

/**
 * Modoo-Marble-style cinematic roll: the die launches up toward the camera,
 * tumbles under gravity, bounces with squash + spark particles, then snaps
 * onto the rolled face with a scale punch and light flash.
 */
export function DiceRollGl({
  width,
  height,
  durationMs,
  variant = "default",
  charge = 0.5,
  forcedValue = null,
  onImpact,
  onRollComplete,
}: DiceRollGlProps) {
  const rafRef = useRef<number | null>(null);
  const callbacksRef = useRef({ onImpact, onRollComplete });
  callbacksRef.current = { onImpact, onRollComplete };
  const configRef = useRef({ durationMs, variant, charge, forcedValue });

  useEffect(
    () => () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    },
    [],
  );

  const onContextCreate = (gl: ExpoWebGLRenderingContext) => {
    const {
      durationMs: tumbleMs,
      variant: dieVariant,
      charge: power,
      forcedValue: forced,
    } = configRef.current;
    const bufferWidth = gl.drawingBufferWidth;
    const bufferHeight = gl.drawingBufferHeight;
    const renderer = createGlRenderer(gl);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      36,
      bufferWidth / bufferHeight,
      0.1,
      40,
    );
    camera.position.set(0, 1.15, 4.6);
    camera.lookAt(0, -0.1, 0);

    scene.add(new THREE.AmbientLight(0xffffff, 1.0));
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.7);
    keyLight.position.set(2.5, 5, 4);
    scene.add(keyLight);

    const die = buildDie(dieVariant);
    const dieScale = 1.18;
    die.scale.setScalar(dieScale);
    scene.add(die);

    const shadowMaterial = new THREE.MeshBasicMaterial({
      color: 0x1c130a,
      transparent: true,
      opacity: 0.3,
    });
    const shadow = new THREE.Mesh(
      new THREE.CircleGeometry(0.52, 32),
      shadowMaterial,
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = REST_Y - 0.58;
    scene.add(shadow);

    const sparkColor = dieVariant === "gold" ? 0xffe082 : 0xeaf4ff;
    const particleGeometry = new THREE.PlaneGeometry(0.07, 0.07);
    const particles: Particle[] = [];
    const spawnSparks = (origin: THREE.Vector3, strength: number) => {
      const count = Math.round(6 + strength * 8);
      for (let i = 0; i < count; i++) {
        if (particles.length >= MAX_PARTICLES) break;
        const sparkMaterial = new THREE.MeshBasicMaterial({
          color: sparkColor,
          transparent: true,
          opacity: 0.95,
        });
        const mesh = new THREE.Mesh(particleGeometry, sparkMaterial);
        mesh.position.set(origin.x, REST_Y - 0.5, origin.z);
        const angle = (i / count) * Math.PI * 2 + Math.random() * 0.7;
        const speed = 1.6 + Math.random() * 1.8 * strength;
        particles.push({
          mesh,
          material: sparkMaterial,
          velocity: new THREE.Vector3(
            Math.cos(angle) * speed,
            1.8 + Math.random() * 2.4 * strength,
            Math.sin(angle) * speed * 0.4,
          ),
          life: 1,
        });
        scene.add(mesh);
      }
    };

    // --- roll script state ---
    const value = toFace(forced);
    const target = FACE_ROTATIONS[value];
    const targetQuat = faceQuaternion(target.rotateX, target.rotateY);

    const throwPower = Math.min(1, Math.max(0, power));
    const spinScale = 0.8 + throwPower * 0.55;
    const position = new THREE.Vector3(0, -0.2, 0);
    const velocity = new THREE.Vector3(
      (Math.random() - 0.5) * (1.8 + throwPower * 1.4),
      7.0 + throwPower * 2.8 + Math.random() * 0.8,
      0,
    );
    const angularVelocity = new THREE.Vector3(
      (Math.random() > 0.5 ? 1 : -1) * (9 + Math.random() * 6) * spinScale,
      (Math.random() > 0.5 ? 1 : -1) * (7 + Math.random() * 6) * spinScale,
      (Math.random() - 0.5) * 6 * spinScale,
    );
    const quat = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI,
      ),
    );
    const spinStep = new THREE.Quaternion();
    const spinAxis = new THREE.Vector3();

    let phase: "tumble" | "settle" | "done" = "tumble";
    let bounces = 0;
    let squash = 0;
    let flash = 0;
    let settleElapsed = 0;
    let settleFromQuat = quat.clone();
    const settleFromPos = new THREE.Vector3();
    let elapsedMs = 0;
    let lastTime: number | null = null;
    const minTumbleMs = Math.min(620, tumbleMs * 0.65);
    const maxTumbleMs = Math.max(900, tumbleMs) + throwPower * 280;

    const startSettle = () => {
      phase = "settle";
      settleElapsed = 0;
      settleFromQuat = quat.clone();
      settleFromPos.copy(position);
    };

    const renderFrame = (now: number) => {
      rafRef.current = requestAnimationFrame(renderFrame);
      const dt = Math.min(
        lastTime === null ? 1 / 60 : (now - lastTime) / 1000,
        1 / 30,
      );
      lastTime = now;
      elapsedMs += dt * 1000;

      if (phase === "tumble") {
        velocity.y += GRAVITY * dt;
        position.addScaledVector(velocity, dt);

        const spinSpeed = angularVelocity.length();
        if (spinSpeed > 0.001) {
          spinAxis.copy(angularVelocity).normalize();
          spinStep.setFromAxisAngle(spinAxis, spinSpeed * dt);
          quat.premultiply(spinStep);
        }

        if (position.y <= REST_Y && velocity.y < 0) {
          position.y = REST_Y;
          const impact = Math.min(1, -velocity.y / 9);
          velocity.y = -velocity.y * RESTITUTION;
          velocity.x *= 0.72;
          angularVelocity.multiplyScalar(0.6);
          bounces += 1;
          squash = 1;
          callbacksRef.current.onImpact?.(impact);
          spawnSparks(position, impact);
        }

        const grounded =
          position.y <= REST_Y + 0.04 && Math.abs(velocity.y) < 2.4;
        if (
          (bounces >= 2 && grounded && elapsedMs >= minTumbleMs) ||
          elapsedMs >= maxTumbleMs
        ) {
          startSettle();
        }
      } else if (phase === "settle") {
        settleElapsed += dt * 1000;
        const t = Math.min(1, settleElapsed / SETTLE_MS);
        const eased = easeOutCubic(t);
        quat.slerpQuaternions(settleFromQuat, targetQuat, eased);
        position.lerpVectors(
          settleFromPos,
          new THREE.Vector3(0, REST_Y, 0),
          eased,
        );
        if (t >= 1) {
          phase = "done";
          flash = 1;
          squash = 0;
          callbacksRef.current.onImpact?.(0.55);
          spawnSparks(position, 0.8);
          callbacksRef.current.onRollComplete(value);
        }
      }

      squash = Math.max(0, squash - dt * 7);
      flash = Math.max(0, flash - dt * 3.2);

      const punch = phase === "done" ? 1 + flash * 0.16 : 1;
      die.position.copy(position);
      die.quaternion.copy(quat);
      die.scale.set(
        dieScale * (1 + squash * 0.12) * punch,
        dieScale * (1 - squash * 0.2) * punch,
        dieScale * (1 + squash * 0.12) * punch,
      );

      const heightAboveRest = Math.max(0, position.y - REST_Y);
      const shadowShrink = Math.max(0.45, 1 - heightAboveRest * 0.22);
      shadow.position.x = position.x;
      shadow.scale.set(shadowShrink, shadowShrink, 1);
      shadowMaterial.opacity = 0.34 * shadowShrink;

      keyLight.intensity = 1.7 + flash * 1.5;

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        if (!p) continue;
        p.velocity.y += GRAVITY * 0.45 * dt;
        p.mesh.position.addScaledVector(p.velocity, dt);
        p.life -= dt * 2.1;
        p.material.opacity = Math.max(0, p.life);
        p.mesh.lookAt(camera.position);
        if (p.life <= 0) {
          scene.remove(p.mesh);
          p.material.dispose();
          particles.splice(i, 1);
        }
      }

      renderer.render(scene, camera);
      gl.endFrameEXP();
    };
    rafRef.current = requestAnimationFrame(renderFrame);
  };

  return (
    <View pointerEvents="none" style={{ width, height }}>
      <GLView onContextCreate={onContextCreate} style={{ width, height }} />
    </View>
  );
}
