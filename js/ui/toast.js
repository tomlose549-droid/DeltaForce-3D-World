// js/ui/toast.js
// 全局 toast 提示：屏幕顶部居中弹出，自动消失

const toastEl = document.getElementById('toast');
let _hideTimer = null;
let _removeTimer = null;

/**
 * 显示 toast 提示
 * @param {string} message    提示内容
 * @param {string} [type]     'info' | 'warn' | 'error' | 'success'（默认 info）
 * @param {number} [duration] 显示时长（毫秒），默认 4000
 */
export function showToast(message, type = 'info', duration = 4000) {
  if (!toastEl) return;

  clearTimeout(_hideTimer);
  clearTimeout(_removeTimer);

  toastEl.textContent = message;
  toastEl.className = 'toast-' + type;
  toastEl.style.display = 'block';

  // 强制 reflow 触发 transition
  void toastEl.offsetWidth;
  toastEl.classList.add('show');

  _hideTimer = setTimeout(() => {
    toastEl.classList.remove('show');
    _removeTimer = setTimeout(() => {
      toastEl.style.display = 'none';
    }, 350);
  }, duration);
}

/** 立即隐藏 toast */
export function hideToast() {
  clearTimeout(_hideTimer);
  clearTimeout(_removeTimer);
  if (!toastEl) return;
  toastEl.classList.remove('show');
  toastEl.style.display = 'none';
}
