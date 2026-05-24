// js/world/card-mesh.js
// 北墙卡牌按钮（ShaderMaterial 彩虹霓虹辉光）

import * as THREE from 'three';

let _cardMat, _cardMesh;

function makeCardIntensityMap() {
  const W = 256, H = 384;
  const cv = document.createElement('canvas');
  cv.width = W; cv.height = H;
  const c = cv.getContext('2d');

  c.fillStyle = 'black';
  c.fillRect(0, 0, W, H);

  // 外框辉光（模糊）
  c.filter = 'blur(10px)';
  c.strokeStyle = 'rgba(255,255,255,0.7)';
  c.lineWidth = 28;
  c.beginPath(); c.roundRect(14, 14, W - 28, H - 28, 20); c.stroke();

  // "?" 辉光（模糊）
  c.filter = 'blur(12px)';
  c.fillStyle = 'rgba(255,255,255,0.55)';
  c.font = 'bold 170px serif';
  c.textAlign = 'center'; c.textBaseline = 'middle';
  c.fillText('?', W / 2, H / 2 + 14);

  // 外框清晰
  c.filter = 'none';
  c.strokeStyle = 'white';
  c.lineWidth = 9;
  c.beginPath(); c.roundRect(14, 14, W - 28, H - 28, 20); c.stroke();

  // "?" 清晰
  c.fillStyle = 'white';
  c.font = 'bold 170px serif';
  c.textAlign = 'center'; c.textBaseline = 'middle';
  c.fillText('?', W / 2, H / 2 + 14);

  return new THREE.CanvasTexture(cv);
}

export function initCardMesh(scene) {
  _cardMat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0.0 },
      uMask: { value: makeCardIntensityMap() },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform sampler2D uMask;
      varying vec2 vUv;
      vec3 rainbow(float t) {
        return 0.5 + 0.5 * cos(6.28318 * (t + vec3(0.0, 0.333, 0.667)));
      }
      void main() {
        float intensity = texture2D(uMask, vUv).r;
        vec3 color = rainbow(uTime * 0.35) * intensity;
        gl_FragColor = vec4(color, 1.0);
      }
    `,
  });

  _cardMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.75), _cardMat);
  _cardMesh.position.set(0, 1.7, -9.97);
  scene.add(_cardMesh);
}

export const getCardMat  = () => _cardMat;
export const getCardMesh = () => _cardMesh;
