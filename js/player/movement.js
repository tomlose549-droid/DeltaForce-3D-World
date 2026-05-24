// js/player/movement.js
// WASD 移动、Shift 加速、碰撞限制、按键状态

export const keys = new Set();

export const isMoving = () =>
  keys.has('KeyW') || keys.has('KeyS') || keys.has('KeyA') || keys.has('KeyD');

export const isShift = () =>
  keys.has('ShiftLeft') || keys.has('ShiftRight');

/**
 * 注册键盘事件
 * @param {function} onSpaceKey  空格键触发的回调（外部决定是否交互）
 */
export function initMovement(onSpaceKey) {
  document.addEventListener('keydown', e => {
    if (e.code === 'Space') {
      e.preventDefault();
      onSpaceKey();
    }
    keys.add(e.code);
  });
  document.addEventListener('keyup', e => keys.delete(e.code));
}

/**
 * 每帧更新移动和碰撞
 * @param {number}                dt
 * @param {PointerLockControls}   controls
 * @param {THREE.Camera}          camera
 * @param {number}                BOUND
 */
export function updateMovement(dt, controls, camera, BOUND) {
  const dist = (isShift() ? 18 : 6) * dt;
  if (keys.has('KeyW')) controls.moveForward(dist);
  if (keys.has('KeyS')) controls.moveForward(-dist);
  if (keys.has('KeyA')) controls.moveRight(-dist);
  if (keys.has('KeyD')) controls.moveRight(dist);
  // 碰撞：限制在围墙内
  camera.position.x = Math.max(-BOUND, Math.min(BOUND, camera.position.x));
  camera.position.z = Math.max(-BOUND, Math.min(BOUND, camera.position.z));
}
