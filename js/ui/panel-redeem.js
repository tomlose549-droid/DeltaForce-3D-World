// js/ui/panel-redeem.js
// 礼物盒兑换 2D 界面：从 JSON 加载兑换码 → 验证 → 发放奖励

import { recordContainer }                    from './stats.js';
import { redeem, isLoadFailed, ResultType }   from './redeem-data.js';
import { showToast }                          from './toast.js';

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
let _loadFailureNotified = false;   // 加载失败提示只显示一次/会话

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
  inputEl.value = '';
  hideResult(true);

  // 安全网：若 JSON 加载失败，首次打开时提示用户（每会话只提示一次）
  if (isLoadFailed() && !_loadFailureNotified) {
    _loadFailureNotified = true;
    showToast(
      '⚠ 兑换码服务异常：部分新码可能不可用，"容器自由"仍可正常使用。建议刷新页面重试。',
      'warn',
      6000
    );
  }

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
  const rawInput = inputEl.value;
  inputEl.value = '';   // 成功失败都清空

  const result = redeem(rawInput);

  switch (result.type) {
    case ResultType.SUCCESS:
      // 发放奖励：按 JSON 中的 rewards 调用 recordContainer
      for (const r of result.rewards) {
        for (let i = 0; i < r.count; i++) {
          recordContainer(r.prefix, r.name);
        }
      }
      showResult('success', '✅ 兑换成功！');
      break;

    case ResultType.EXPIRED:
      showResult('fail', '❌ 兑换失败：该兑换码已过期');
      break;

    case ResultType.USED_UP:
      showResult('fail', '❌ 兑换失败：该兑换码已用完');
      break;

    case ResultType.INVALID:
    default:
      showResult('fail', '❌ 兑换失败：兑换码无效');
      break;
  }
}

/**
 * 显示兑换结果（2.5 秒后淡出）
 * @param {string} kind     'success' | 'fail'
 * @param {string} text     展示文本
 */
function showResult(kind, text) {
  clearTimeout(_resultTimer);
  clearTimeout(_hideTimer);

  resultEl.className = kind === 'success' ? 'redeem-success' : 'redeem-fail';
  resultEl.textContent = text;
  resultEl.style.display = 'block';
  // 触发动画重启（移除并重加 show 类）
  resultEl.classList.remove('show');
  void resultEl.offsetWidth;
  resultEl.classList.add('show');

  // 2.5 秒后开始淡出
  _resultTimer = setTimeout(() => {
    resultEl.classList.remove('show');
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
