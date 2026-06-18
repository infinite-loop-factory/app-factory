import type { DiceFaceValue } from "@/components/dice/dice-orientations";
import type { DiceVariant } from "@/components/dice/dice-variant";

import * as THREE from "three";
import { resolveDiceMaterial } from "@/components/dice/dice-glass-material";
import { PIP_POSITIONS } from "@/components/dice/dice-pips";

export const DEG = Math.PI / 180;
/** BoxGeometry material order [+x, -x, +y, -y, +z, -z] → die faces (opposites sum to 7). */
const BOX_FACE_ORDER: DiceFaceValue[] = [2, 5, 3, 4, 1, 6];
const PIP_RADIUS = 0.085;
const PIP_LIFT = 0.504;

/** Map face-plane coords (a: right, b: up, both -0.5..0.5) onto each cube face. */
function pipTransform(
  face: DiceFaceValue,
  a: number,
  b: number,
): { position: [number, number, number]; rotation: [number, number, number] } {
  switch (face) {
    case 1:
      return { position: [a, b, PIP_LIFT], rotation: [0, 0, 0] };
    case 6:
      return { position: [-a, b, -PIP_LIFT], rotation: [0, Math.PI, 0] };
    case 2:
      return { position: [PIP_LIFT, b, -a], rotation: [0, Math.PI / 2, 0] };
    case 5:
      return { position: [-PIP_LIFT, b, a], rotation: [0, -Math.PI / 2, 0] };
    case 3:
      return { position: [a, PIP_LIFT, -b], rotation: [-Math.PI / 2, 0, 0] };
    default:
      return { position: [a, -PIP_LIFT, b], rotation: [Math.PI / 2, 0, 0] };
  }
}

export function buildDie(variant: DiceVariant): THREE.Group {
  const material = resolveDiceMaterial(variant);
  const metalness = variant === "gold" ? 0.55 : 0.12;
  const die = new THREE.Group();

  const faceMaterials = BOX_FACE_ORDER.map(
    (face) =>
      new THREE.MeshStandardMaterial({
        color: material.faceLight(face),
        roughness: 0.32,
        metalness,
      }),
  );
  die.add(new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), faceMaterials));

  const pipMaterial = new THREE.MeshStandardMaterial({
    color: material.pip,
    roughness: 0.5,
    metalness: 0,
  });
  const pipGeometry = new THREE.CircleGeometry(PIP_RADIUS, 24);
  for (const face of BOX_FACE_ORDER) {
    for (const [u, v] of PIP_POSITIONS[face]) {
      const { position, rotation } = pipTransform(face, u - 0.5, 0.5 - v);
      const pip = new THREE.Mesh(pipGeometry, pipMaterial);
      pip.position.set(...position);
      pip.rotation.set(...rotation);
      die.add(pip);
    }
  }
  return die;
}

/**
 * three.js renderer on an expo-gl context. expo-gl exposes a WebGL2 context
 * without a DOM canvas; three only touches these canvas fields.
 */
type PatchableGl = {
  UNPACK_FLIP_Y_WEBGL?: number;
  pixelStorei?: (pname: number, param: number | boolean) => void;
  __pixelStoreiPatched?: boolean;
};

/**
 * expo-gl only implements pixelStorei(UNPACK_FLIP_Y_WEBGL); three calls it
 * with other parameters on every texture upload, spamming
 * "EXGL: gl.pixelStorei() doesn't support this parameter yet!".
 * Drop unsupported parameters before three sees the context.
 */
function patchPixelStorei(gl: PatchableGl): void {
  if (gl.__pixelStoreiPatched || typeof gl.pixelStorei !== "function") return;
  const original = gl.pixelStorei.bind(gl);
  const flipY = gl.UNPACK_FLIP_Y_WEBGL;
  gl.pixelStorei = (pname, param) => {
    if (pname === flipY) original(pname, param);
  };
  gl.__pixelStoreiPatched = true;
}

export function createGlRenderer(gl: {
  drawingBufferWidth: number;
  drawingBufferHeight: number;
}): THREE.WebGLRenderer {
  patchPixelStorei(gl as PatchableGl);
  const width = gl.drawingBufferWidth;
  const height = gl.drawingBufferHeight;
  const renderer = new THREE.WebGLRenderer({
    canvas: {
      width,
      height,
      style: {},
      clientHeight: height,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      getContext: () => gl,
    } as unknown as HTMLCanvasElement,
    context: gl as unknown as WebGL2RenderingContext,
    antialias: true,
    alpha: true,
  });
  renderer.setSize(width, height, false);
  renderer.setClearColor(0x000000, 0);
  return renderer;
}

/**
 * Orientation that shows `face` toward the camera. FACE_ROTATIONS are
 * authored in screen coords (y down); three.js y is up, so x/z flip sign.
 */
export function faceQuaternion(
  rotateX: number,
  rotateY: number,
): THREE.Quaternion {
  return new THREE.Quaternion().setFromEuler(
    new THREE.Euler(-rotateX * DEG, rotateY * DEG, 0, "XYZ"),
  );
}
