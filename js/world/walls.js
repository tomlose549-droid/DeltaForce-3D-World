// js/world/walls.js
// 大理石围墙（内侧 20×20，高 3，厚 1）+ 碰撞边界常量

import * as THREE from 'three';

/** 碰撞边界：内壁 ±10，减去玩家半径 0.3 */
export const BOUND = 9.7;

export function initWalls(scene, renderer) {
  const loader     = new THREE.TextureLoader();
  const baseMarble = loader.load('./assets/textures/marble.jpg');
  baseMarble.wrapS      = baseMarble.wrapT = THREE.RepeatWrapping;
  baseMarble.colorSpace = THREE.SRGBColorSpace;
  baseMarble.anisotropy = renderer.capabilities.getMaxAnisotropy();

  function wallMat(rx, ry) {
    const tex = baseMarble.clone();
    tex.wrapS      = tex.wrapT = THREE.RepeatWrapping;
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
    tex.repeat.set(rx, ry);
    tex.needsUpdate = true;
    return new THREE.MeshStandardMaterial({ map: tex, roughness: 0.45, metalness: 0.0 });
  }

  // 北墙（玩家正前方，z = -10.5），宽 22 含角落
  const n = new THREE.Mesh(new THREE.BoxGeometry(22, 3, 1), wallMat(1.8, 1));
  n.position.set(0, 1.5, -10.5);
  scene.add(n);

  // 南墙
  const s = new THREE.Mesh(new THREE.BoxGeometry(22, 3, 1), wallMat(1.8, 1));
  s.position.set(0, 1.5, 10.5);
  scene.add(s);

  // 东墙
  const e = new THREE.Mesh(new THREE.BoxGeometry(1, 3, 20), wallMat(1.6, 1));
  e.position.set(10.5, 1.5, 0);
  scene.add(e);

  // 西墙
  const w = new THREE.Mesh(new THREE.BoxGeometry(1, 3, 20), wallMat(1.6, 1));
  w.position.set(-10.5, 1.5, 0);
  scene.add(w);
}
