// js/main.js
// 应用入口：初始化所有模块、连接依赖、启动主循环

import * as THREE from 'three';
import { loadLootData }                           from './ui/loot.js';
import { openShippingPanel, initShippingPanel }   from './ui/panel-shipping.js';
import { updateFootstep }                         from './audio/footstep.js';
import { initParticles, updateParticles }         from './player/particles.js';
import { initScene, initCamera, initRenderer }    from './core/scene.js';
import { initLights }                             from './core/lights.js';
import { initResize }                             from './core/resize.js';
import { initFloor }                              from './world/floor.js';
import { initWalls, BOUND }                       from './world/walls.js';
import { initSkyCubes, updateSkyCubes }           from './world/sky-cubes.js';
import { initCardMesh, getCardMat, getCardMesh }  from './world/card-mesh.js';
import { initControls }                           from './player/controls.js';
import { initMovement, isMoving, isShift,
         updateMovement }                         from './player/movement.js';
import { initRaycaster, checkCardAim,
         isAimingAtCard, resetAim }               from './player/raycaster.js';
import { initCardUI, openCardUI, isCardUIOpen }   from './ui/card-ui.js';
import { initContainerPanel }                     from './ui/panel-container.js';

// 预加载战利品数据（ES module 支持顶层 await）
await loadLootData();

// ── 场景初始化 ────────────────────────────────────────
const scene    = initScene();
const camera   = initCamera();
const renderer = initRenderer();

initLights(scene);
initFloor(scene);
initParticles(scene);
initWalls(scene, renderer);
initSkyCubes(scene);
initCardMesh(scene);

// ── 控制器与界面 ──────────────────────────────────────
const controls = initControls(camera, scene, isCardUIOpen);
initCardUI(controls);
initShippingPanel();
initContainerPanel();

document.querySelectorAll('.loc-btn').forEach(btn => {
  btn.addEventListener('click', () => openShippingPanel(btn.dataset.loc));
});

// ── 射线检测 ──────────────────────────────────────────
const interactHint = document.getElementById('interact-hint');
initRaycaster(camera, getCardMesh(), interactHint);

// ── 按键（空格交互） ──────────────────────────────────
initMovement(() => {
  if (controls.isLocked && isAimingAtCard()) openCardUI();
});

// ── 窗口自适应 ────────────────────────────────────────
initResize(camera, renderer);

// ── 主循环 ────────────────────────────────────────────
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  // 方案 A：卡牌界面打开时跳过 3D 渲染（玩家看不到 3D 场景，节省 GPU/CPU）
  // 仍然消费 clock 增量，避免界面关闭时第一帧 dt 暴涨导致天空立方体瞬移
  if (isCardUIOpen()) {
    clock.getDelta();
    return;
  }

  const dt     = clock.getDelta();
  const locked = controls.isLocked;

  if (locked) {
    updateMovement(dt, controls, camera, BOUND);
    updateFootstep(dt, isMoving, isShift);
    checkCardAim();
  } else {
    resetAim();
  }

  getCardMat().uniforms.uTime.value += dt;
  updateParticles(dt, locked, isMoving, camera);
  updateSkyCubes(dt);
  renderer.render(scene, camera);
}

animate();
