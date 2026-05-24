// js/ui/card-ui.js
// 卡牌 2D 界面：打开/关闭、子面板切换、按钮事件

let _controls;
let _cardUIOpen = false;

const cardUI       = document.getElementById('card-ui');
const overlay      = document.getElementById('overlay');
const interactHint = document.getElementById('interact-hint');
const panelDraw           = document.getElementById('panel-draw');
const panelContainer      = document.getElementById('panel-container');
const panelContainerStats = document.getElementById('panel-container-stats');
const panelShipping       = document.getElementById('panel-shipping');
const btnDraw             = document.getElementById('btn-draw');
const btnContainer        = document.getElementById('btn-container');

/** 返回卡牌界面当前是否打开（供 controls.js unlock 事件判断） */
export const isCardUIOpen = () => _cardUIOpen;

/**
 * 初始化卡牌界面事件
 * @param {PointerLockControls} controls
 */
export function initCardUI(controls) {
  _controls = controls;

  document.getElementById('btn-exit').addEventListener('click', closeCardUI);

  btnDraw.addEventListener('click', () => {
    panelDraw.style.display      = 'block';
    panelContainer.style.display = 'none';
    btnDraw.style.display        = 'none';   // 隐藏抽卡，保留容器
  });

  btnContainer.addEventListener('click', () => {
    panelContainer.style.display = 'block';
    panelDraw.style.display      = 'none';
    btnContainer.style.display   = 'none';   // 隐藏容器，保留抽卡
  });
}

/** 打开卡牌界面（解锁鼠标、隐藏提示） */
export function openCardUI() {
  _cardUIOpen = true;
  _controls.unlock();
  cardUI.style.display      = 'flex';
  interactHint.style.display = 'none';
}

/** 关闭卡牌界面（重置面板、重新锁定鼠标） */
export function closeCardUI() {
  resetPanels();
  cardUI.style.display = 'none';
  _cardUIOpen = false;
  _controls.lock();
}

/** 重置所有子面板到默认隐藏状态 */
export function resetPanels() {
  panelDraw.style.display           = 'none';
  panelContainer.style.display      = 'none';
  panelContainerStats.style.display = 'none';
  panelShipping.style.display       = 'none';
  btnDraw.style.display             = '';
  btnContainer.style.display        = '';
}
