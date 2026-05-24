// js/world/sky-cubes.js
// 12 个漂浮天空玻璃立方体及其漂移动画

import * as THREE from 'three';

const skyCubes = [];

export function initSkyCubes(scene) {
  const glassMat = new THREE.MeshStandardMaterial({
    color:       0x050814,
    transparent: true,
    opacity:     0.42,
    roughness:   0.04,
    metalness:   0.25,
    side:        THREE.DoubleSide,
    depthWrite:  false,
  });
  const edgeMat = new THREE.LineBasicMaterial({
    color:       0x4455cc,
    transparent: true,
    opacity:     0.55,
  });

  for (let i = 0; i < 12; i++) {
    const size = 20 + Math.random() * 8;          // 20~28 格
    const geo  = new THREE.BoxGeometry(size, size, size);
    const cube = new THREE.Mesh(geo, glassMat);

    cube.position.set(
      (Math.random() - 0.5) * 160,
      52 + Math.random() * 12,                    // 高度 52~64
      (Math.random() - 0.5) * 160
    );
    cube.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    );

    cube.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo), edgeMat));

    cube.userData = {
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.15,
      vz: (Math.random() - 0.5) * 0.8,
      rx: (Math.random() - 0.5) * 0.12,
      ry: (Math.random() - 0.5) * 0.18,
      rz: (Math.random() - 0.5) * 0.08,
      baseY: 52 + Math.random() * 12,
    };

    scene.add(cube);
    skyCubes.push(cube);
  }
}

export function updateSkyCubes(dt) {
  for (const cube of skyCubes) {
    const u = cube.userData;
    cube.position.x += u.vx * dt;
    cube.position.y += u.vy * dt;
    cube.position.z += u.vz * dt;
    cube.rotation.x += u.rx * dt;
    cube.rotation.y += u.ry * dt;
    cube.rotation.z += u.rz * dt;
    // 漂移边界反弹
    if (Math.abs(cube.position.x) > 120)           u.vx *= -1;
    if (Math.abs(cube.position.z) > 120)           u.vz *= -1;
    if (Math.abs(cube.position.y - u.baseY) > 8)  u.vy *= -1;
  }
}
