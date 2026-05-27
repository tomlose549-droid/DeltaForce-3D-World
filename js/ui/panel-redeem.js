// js/ui/panel-redeem.js
// 礼物盒兑换 2D 界面：输入兑换码 → 验证 → 发放奖励到「绝密」分类

import { recordContainer } from './stats.js';

// ── 兑换配置 ───────────────────────────────────────────────
const VALID_CODE = '容器自由';
const REWARD_PREFIX = '绝密';
const REWARDS = [
  { name: '典狱长的审判', count: 10 },
  { name: '沙色大保险',   count: 10 },
  { name: '大保险箱',     count: 10 },
];

// ── DOM 引用 ───────────────────────────────────────────────
const redeemUI    = document.getElementById('redeem-ui');
const inputEl     = document.getElementById('redeem-input');
const btnConfirm  = document.getElementById('redeem-confirm');
const btnExit     = document.getElementById('redeem-exit');
const resultEl    = document.getElementById('redeem-result');
const interactHint = document.getElementById('interact-hint');

let _controls;
let _redeemUIOpen = false;
let _resultTimer = null;
let _hideTimer = null;

/** 兑换界面是否打开（供 raycaster / animate 主循环 / controls 判断） */
export const isRedeemUIOpen = () => _redeemUIOpen;

/**
 * 初始化兑换面板：绑定按钮、输入框、回车键
 * @param {PointerLockControls} controls
 */
export function initRedeemPanel(controls) {
  _controls = controls;

  btnExit.addEventListener('click', closeRedeemUI);
  btnConfirm.addEventListener('click', tryRedeem);
  inputEl.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      tryRedeem();
    }
  });
}

/** 打开兑换界面 */
export function openRedeemUI() {
  _redeemUIOpen = true;
  _controls.unlock();
  redeemUI.style.display = 'flex';
  interactHint.style.display = 'none';
  // 清空输入框并隐藏旧结果
  inputEl.value = '';
  hideResult(true);
  // 自动聚焦输入框（延迟避免被 PointerLock 释放抢占）
  setTimeout(() => inputEl.focus(), 60);
}

/** 关闭兑换界面，回到 3D 场景 */
export function closeRedeemUI() {
  redeemUI.style.display = 'none';
  _redeemUIOpen = false;
  inputEl.value = '';
  hideResult(true);
  _controls.lock();
}

// ── 内部 ───────────────────────────────────────────────────

function tryRedeem() {
  const code = inputEl.value.trim();
  inputEl.value = '';   // 成功失败都清空

  if (code === VALID_CODE) {
    // 发放奖励：3 种容器各 10 个，写入「绝密」分类
    for (const r of REWARDS) {
      for (let i = 0; i < r.count; i++) {
        recordContainer(REWARD_PREFIX, r.name);
      }
    }
    showResult(true);
  } else {
    showResult(false);
  }
}

/**
 * 显示兑换结果（2.5 秒后淡出）
 * @param {boolean} success
 */
function showResult(success) {
  clearTimeout(_resultTimer);
  clearTimeout(_hideTimer);

  resultEl.className = success ? 'redeem-success' : 'redeem-fail';
  resultEl.textContent = success ? '✅ 兑换成功！' : '❌ 兑换失败：兑换码无效';
  resultEl.style.display = 'block';
  // 触发动画重启（移除并重加 show 类）
  resultEl.classList.remove('show');
  void resultEl.offsetWidth;  // 强制 reflow
  resultEl.classList.add('show');

  // 2.5 秒后开始淡出
  _resultTimer = setTimeout(() => {
    resultEl.classList.remove('show');
    // 等淡出动画完成再 display:none
    _hideTimer = setTimeout(() => {
      resultEl.style.display = 'none';
    }, 350);
  }, 2500);
}

function hideResult(immediate = false) {
  clearTimeout(_resultTimer);
  clearTimeout(_hideTimer);
  resultEl.classList.remove('show');
  if (immediate) {
    resultEl.style.display = 'none';
  }
}
