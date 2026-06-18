import { type ExpoWebGLRenderingContext, GLView } from "expo-gl";
import { useState } from "react";
import { View } from "react-native";
import * as THREE from "three";
import { buildDie, createGlRenderer } from "@/components/dice/dice-mesh";

let warmed = false;

/**
 * Compiles the die materials once on a hidden 1×1 context so the first
 * cinematic roll doesn't stall on shader compilation.
 */
export function DiceGlPrewarm() {
  const [done, setDone] = useState(warmed);
  if (done) return null;

  const onContextCreate = (gl: ExpoWebGLRenderingContext) => {
    try {
      const renderer = createGlRenderer(gl);
      const scene = new THREE.Scene();
      scene.add(new THREE.AmbientLight(0xffffff, 1));
      const light = new THREE.DirectionalLight(0xffffff, 1.5);
      light.position.set(2, 4, 5);
      scene.add(light);
      const blue = buildDie("default");
      const gold = buildDie("gold");
      gold.position.x = 2;
      scene.add(blue);
      scene.add(gold);
      const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 10);
      camera.position.z = 4;
      renderer.render(scene, camera);
      gl.endFrameEXP();
    } finally {
      warmed = true;
      setTimeout(() => setDone(true), 0);
    }
  };

  return (
    <View
      pointerEvents="none"
      style={{ position: "absolute", width: 1, height: 1, opacity: 0 }}
    >
      <GLView
        onContextCreate={onContextCreate}
        style={{ width: 1, height: 1 }}
      />
    </View>
  );
}
