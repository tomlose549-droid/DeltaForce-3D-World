// js/player/raycaster.js
// 准星射线检测：同时支持卡牌和礼物盒，瞄准时显示交互提示

import * as THREE from 'three';

const raycaster = new THREE.Raycaster();
let _camera, _cardMesh, _giftMesh, _interactHint;
let aimingAtCard = false;
let aimingAtGift = false;

/**
 * 初始化射线检测器
 * @param {THREE.Camera}    camera
 * @param {THREE.Mesh}      cardMesh
 * @param {THREE.Mesh}      giftMesh
 * @param {HTMLElement}     interactHint
 */
export function initRaycaster(camera, cardMesh, giftMesh, interactHint) {
  _camera       = camera;
  _cardMesh     = cardMesh;
  _giftMesh     = giftMesh;
  _interactHint = interactHint;
}

/** 当前帧是否正在瞄准卡牌 */
export const isAimingAtCard = () => aimingAtCard;
/** 当前帧是否正在瞄准礼物盒 */
export const isAimingAtGift = () => aimingAtGift;

/**
 * 每帧调用：检测卡牌和礼物盒，控制交互提示显示
 */
export function checkAimTargets() {
  raycaster.setFromCamera({ x: 0, y: 0 }, _camera);

  // 卡牌检测
  const cardHits = raycaster.intersectObject(_cardMesh);
  const newAimingCard = cardHits.length > 0 && cardHits[0].distance < 5;

  // 礼物盒检测
  const giftHits = raycaster.intersectObject(_giftMesh);
  const newAimingGift = giftHits.length > 0 && giftHits[0].distance < 5;

  const wasAimingAny = aimingAtCard || aimingAtGift;
  const isAimingAny  = newAimingCard || newAimingGift;

  if (isAimingAny && !wasAimingAny) _interactHint.style.display = 'block';
  else if (!isAimingAny && wasAimingAny) _interactHint.style.display = 'none';

  aimingAtCard = newAimingCard;
  aimingAtGift = newAimingGift;
}

/** 非锁定状态下重置瞄准（隐藏提示） */
export function resetAim() {
  if (aimingAtCard || aimingAtGift) _interactHint.style.display = 'none';
  aimingAtCard = false;
  aimingAtGift = false;
}
