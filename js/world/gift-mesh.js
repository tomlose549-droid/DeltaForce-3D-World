// js/world/gift-mesh.js
// 南墙礼物盒按钮（ShaderMaterial 彩虹霓虹辉光，与卡牌按钮对称）

import * as THREE from 'three';

let _giftMat, _giftMesh;

function makeGiftIntensityMap() {
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

  // 礼物盒辉光（模糊）
  c.filter = 'blur(9px)';
  c.fillStyle = 'rgba(255,255,255,0.55)';
  // 盒身
  c.beginPath(); c.roundRect(48, 200, 160, 144, 8); c.fill();
  // 蝴蝶结左瓣
  c.beginPath(); c.ellipse(102, 174, 36, 30, 0, 0, Math.PI * 2); c.fill();
  // 蝴蝶结右瓣
  c.beginPath(); c.ellipse(154, 174, 36, 30, 0, 0, Math.PI * 2); c.fill();
  // 蝴蝶结中央结
  c.beginPath(); c.roundRect(118, 162, 20, 24, 4); c.fill();

  // 外框清晰
  c.filter = 'none';
  c.strokeStyle = 'white';
  c.lineWidth = 9;
  c.beginPath(); c.roundRect(14, 14, W - 28, H - 28, 20); c.stroke();

  // 盒身轮廓（清晰）
  c.strokeStyle = 'white';
  c.lineWidth = 7;
  c.beginPath(); c.roundRect(48, 200, 160, 144, 8); c.stroke();

  // 竖向丝带
  c.fillStyle = 'white';
  c.fillRect(118, 200, 20, 144);
  // 横向丝带
  c.fillRect(48, 254, 160, 18);

  // 蝴蝶结左右瓣（清晰，环形）
  c.lineWidth = 6;
  c.beginPath(); c.ellipse(102, 174, 36, 28, 0, 0, Math.PI * 2); c.stroke();
  c.beginPath(); c.ellipse(154, 174, 36, 28, 0, 0, Math.PI * 2); c.stroke();
  // 蝴蝶结内孔（涂黑制造环形效果）
  c.fillStyle = 'black';
  c.beginPath(); c.ellipse(102, 174, 19, 13, 0, 0, Math.PI * 2); c.fill();
  c.beginPath(); c.ellipse(154, 174, 19, 13, 0, 0, Math.PI * 2); c.fill();

  // 蝴蝶结中央结
  c.fillStyle = 'white';
  c.beginPath(); c.roundRect(118, 160, 20, 26, 4); c.fill();

  return new THREE.CanvasTexture(cv);
}

export function initGiftMesh(scene) {
  _giftMat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0.0 },
      uMask: { value: makeGiftIntensityMap() },
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

  _giftMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.75), _giftMat);
  _giftMesh.position.set(0, 1.7, 9.97);
  _giftMesh.rotation.y = Math.PI;   // 旋转 180° 让正面朝向玩家
  scene.add(_giftMesh);
}

export const getGiftMat  = () => _giftMat;
export const getGiftMesh = () => _giftMesh;
