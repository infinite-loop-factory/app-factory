import type { DiceVariant } from "@/components/dice/dice-variant";
import type { CraftPalette } from "@/game/constants/palettes";

import { type ExpoWebGLRenderingContext, GLView } from "expo-gl";
import { useEffect, useRef } from "react";
import { View } from "react-native";
import * as THREE from "three";
import { buildDie, createGlRenderer, DEG } from "@/components/dice/dice-mesh";
import { useDiceCubeMotion } from "@/components/dice/use-dice-cube-motion";

type DiceCubeGlProps = {
  value: number | null;
  rolling?: boolean;
  palette: CraftPalette;
  size?: number;
  variant?: DiceVariant;
  reducedMotion?: boolean;
};

/** expo-gl + three.js die — idle settle / tumble driven by useDiceCubeMotion. */
export function DiceCubeGl({
  value,
  rolling = false,
  palette,
  size = 72,
  variant = "default",
  reducedMotion = false,
}: DiceCubeGlProps) {
  const canvasHeight = size + 30;
  const motion = useDiceCubeMotion(value, rolling, {
    size,
    reducedMotion,
    singleFace: false,
  });
  const motionRef = useRef(motion);
  motionRef.current = motion;
  const rafRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    },
    [],
  );

  const onContextCreate = (gl: ExpoWebGLRenderingContext) => {
    const width = gl.drawingBufferWidth;
    const height = gl.drawingBufferHeight;
    const renderer = createGlRenderer(gl);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 20);
    camera.position.set(0, 0.25, 3.1);
    camera.lookAt(0, 0, 0);

    scene.add(new THREE.AmbientLight(0xffffff, 1.1));
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.6);
    keyLight.position.set(2, 4, 5);
    scene.add(keyLight);

    const die = buildDie(variant);
    die.position.y = 0.08;
    scene.add(die);

    const shadowMaterial = new THREE.MeshBasicMaterial({
      color: palette.walnut,
      transparent: true,
      opacity: 0.24,
    });
    const shadow = new THREE.Mesh(
      new THREE.CircleGeometry(0.46, 32),
      shadowMaterial,
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = -0.62;
    scene.add(shadow);

    const renderFrame = () => {
      rafRef.current = requestAnimationFrame(renderFrame);
      const m = motionRef.current;
      // FACE_ROTATIONS are authored in screen coords (y down); three.js y is
      // up, so rotations about x/z flip sign while y keeps its direction.
      die.rotation.set(
        -m.rotX.get() * DEG,
        m.rotY.get() * DEG,
        -m.rotZ.get() * DEG,
        "XYZ",
      );
      die.position.x = m.translateX.get() / size;
      die.position.y = 0.08 - m.translateY.get() / size;
      die.scale.setScalar(m.scale.get());
      const sh = m.shadowScale.get();
      shadow.scale.set(sh, sh * 0.65, 1);
      shadowMaterial.opacity = 0.2 + (1 - sh) * 0.32;
      renderer.render(scene, camera);
      gl.endFrameEXP();
    };
    renderFrame();
  };

  return (
    <View pointerEvents="none" style={{ width: size, height: canvasHeight }}>
      <GLView
        key={`die-${variant}-${palette.walnut}`}
        onContextCreate={onContextCreate}
        style={{ width: size, height: canvasHeight }}
      />
    </View>
  );
}
