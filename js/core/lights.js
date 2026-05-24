// js/core/lights.js
// 环境光 + 方向光 + 半球光

import * as THREE from 'three';

export function initLights(scene) {
  scene.add(new THREE.AmbientLight(0xffffff, 1.1));

  const sun = new THREE.DirectionalLight(0xffffff, 0.55);
  sun.position.set(5, 12, 8);
  scene.add(sun);

  // 半球光：天空漫反射补光，减少暗部过暗
  const hemi = new THREE.HemisphereLight(0xffffff, 0xe8e8e8, 0.5);
  scene.add(hemi);
}
