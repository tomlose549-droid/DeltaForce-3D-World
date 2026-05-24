// js/player/controls.js
// PointerLockControls：视角锁定、灵敏度滑块、进入/退出逻辑

import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

let _controls;

/**
 * 初始化控制器
 * @param {THREE.Camera} camera
 * @param {THREE.Scene}  scene
 * @param {function}     isCardUIOpenFn  返回卡牌界面是否打开（避免循环依赖）
 */
export function initControls(camera, scene, isCardUIOpenFn) {
  _controls = new PointerLockControls(camera, document.body);
  scene.add(_controls.getObject());

  const overlay    = document.getElementById('overlay');
  const sensSlider = document.getElementById('sensitivity');
  const sensLabel  = document.getElementById('sens-val');

  // 灵敏度滑块
  _controls.pointerSpeed = 1.0;
  sensSlider.addEventListener('input', () => {
    const v = parseFloat(sensSlider.value);
    sensLabel.textContent = v.toFixed(1);
    _controls.pointerSpeed = v;
  });

  // 进入按钮
  document.getElementById('enter-btn').addEventListener('click', () => _controls.lock());

  // 锁定：隐藏遮罩
  _controls.addEventListener('lock', () => {
    overlay.style.display = 'none';
  });

  // 解锁：若卡牌界面未打开则显示遮罩
  _controls.addEventListener('unlock', () => {
    if (!isCardUIOpenFn()) overlay.style.display = 'flex';
  });

  return _controls;
}

export const getControls = () => _controls;
