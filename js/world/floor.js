// js/world/floor.js
// 无限网格地板

import * as THREE from 'three';

export function initFloor(scene) {
  scene.add(new THREE.GridHelper(2000, 200, 0x888888, 0x555555));
}
