// js/core/scene.js
// 场景、相机、渲染器初始化

import * as THREE from 'three';

export function initScene() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xdce3e8);
  scene.fog = new THREE.FogExp2(0xdce3e8, 0.003);
  return scene;
}

export function initCamera() {
  const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 2000);
  camera.position.set(0, 1.7, 0);
  return camera;
}

export function initRenderer() {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(devicePixelRatio);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  document.body.appendChild(renderer.domElement);
  return renderer;
}
