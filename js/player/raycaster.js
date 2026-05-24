// js/player/raycaster.js
// 准星射线检测：瞄准卡牌时显示交互提示

import * as THREE from 'three';

const raycaster = new THREE.Raycaster();
let _camera, _cardMesh, _interactHint;
let aimingAtCard = false;

/**
 * 初始化射线检测器
 * @param {THREE.Camera}    camera
 * @param {THREE.Mesh}      cardMesh
 * @param {HTMLElement}     interactHint
 */
export function initRaycaster(camera, cardMesh, interactHint) {
  _camera      = camera;
  _cardMesh    = cardMesh;
  _interactHint = interactHint;
}

/** 返回当前帧是否正在瞄准卡牌 */
export const isAimingAtCard = () => aimingAtCard;

/** 每帧调用：更新瞄准状态并控制交互提示显示 */
export function checkCardAim() {
  raycaster.setFromCamera({ x: 0, y: 0 }, _camera);
  const hits = raycaster.intersectObject(_cardMesh);
  if (hits.length > 0 && hits[0].distance < 5) {
    if (!aimingAtCard) _interactHint.style.display = 'block';
    aimingAtCard = true;
  } else {
    if (aimingAtCard) _interactHint.style.display = 'none';
    aimingAtCard = false;
  }
}

/** 非锁定状态下重置瞄准（隐藏提示） */
export function resetAim() {
  if (aimingAtCard) _interactHint.style.display = 'none';
  aimingAtCard = false;
}
