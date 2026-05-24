// js/player/particles.js
// 玩家移动脚下粒子系统（GLSL ShaderMaterial，逐粒子透明度）

import * as THREE from 'three';

const MAX_P    = 800;
const LIFETIME = 2.0;

const posArr = new Float32Array(MAX_P * 3);
const alpArr = new Float32Array(MAX_P);

const pGeo = new THREE.BufferGeometry();
pGeo.setAttribute('position', new THREE.BufferAttribute(posArr, 3));
pGeo.setAttribute('alpha',    new THREE.BufferAttribute(alpArr, 1));

const pMat = new THREE.ShaderMaterial({
  vertexShader: `
    attribute float alpha; varying float vA;
    void main() {
      vA = alpha;
      gl_PointSize = 4.0;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }`,
  fragmentShader: `
    varying float vA;
    void main() {
      if (length(gl_PointCoord - 0.5) > 0.5) discard;
      gl_FragColor = vec4(1.0, 1.0, 1.0, vA);
    }`,
  transparent: true,
  depthWrite:  false,
});

const pool = Array.from({ length: MAX_P }, () =>
  ({ active: false, x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0, life: 0 }));

let spawnTimer = 0;

function spawnBatch(camera) {
  const count = Math.floor(Math.random() * 21) + 10;
  let n = 0;
  for (let i = 0; i < MAX_P && n < count; i++) {
    if (pool[i].active) continue;
    const p = pool[i];
    const a = Math.random() * Math.PI * 2;
    const r = Math.random() * 1.5;
    p.active = true; p.life = 0;
    p.x  = camera.position.x + Math.cos(a) * r;
    p.y  = 0.05 + Math.random() * 0.1;
    p.z  = camera.position.z + Math.sin(a) * r;
    p.vx = (Math.random() - 0.5) * 0.6;
    p.vy = Math.random() * 1.2 + 0.4;
    p.vz = (Math.random() - 0.5) * 0.6;
    n++;
  }
}

/**
 * 将粒子点云加入场景（初始化时调用一次）
 * @param {THREE.Scene} scene
 */
export function initParticles(scene) {
  scene.add(new THREE.Points(pGeo, pMat));
}

/**
 * 每帧更新粒子状态
 * @param {number}        dt         帧时间（秒）
 * @param {boolean}       locked     鼠标是否锁定（游戏激活中）
 * @param {function}      isMovingFn 是否正在移动（返回 boolean）
 * @param {THREE.Camera}  camera     用于获取玩家位置
 */
export function updateParticles(dt, locked, isMovingFn, camera) {
  if (locked && isMovingFn()) {
    spawnTimer += dt;
    if (spawnTimer >= 0.05) { spawnTimer -= 0.05; spawnBatch(camera); }
  } else {
    spawnTimer = 0;
  }

  for (let i = 0; i < MAX_P; i++) {
    const p = pool[i];
    if (!p.active) {
      posArr[i * 3 + 1] = -9999; alpArr[i] = 0; continue;
    }
    p.life += dt;
    if (p.life >= LIFETIME) {
      p.active = false; posArr[i * 3 + 1] = -9999; alpArr[i] = 0; continue;
    }
    p.vy = Math.max(0, p.vy - 0.5 * dt);
    p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt;
    posArr[i * 3]     = p.x;
    posArr[i * 3 + 1] = p.y;
    posArr[i * 3 + 2] = p.z;
    alpArr[i] = 1.0 - p.life / LIFETIME;
  }
  pGeo.attributes.position.needsUpdate = true;
  pGeo.attributes.alpha.needsUpdate    = true;
}
