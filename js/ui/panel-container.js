// js/ui/panel-container.js
// 容器分类面板：三分类（常规/机密/绝密）→ 容器统计网格展示

import { getStatsByPrefix } from './stats.js';
import { makeItemIcon }     from './icons.js';

// ── DOM 引用 ───────────────────────────────────────────────
const panelContainer      = document.getElementById('panel-container');
const panelContainerStats = document.getElementById('panel-container-stats');
const containerGrid       = document.getElementById('container-grid');
const emptyHint           = document.getElementById('container-empty-hint');
const btnBack             = document.getElementById('btn-back-container');
const btnDraw             = document.getElementById('btn-draw');
const btnContainer        = document.getElementById('btn-container');

/**
 * 初始化：绑定三分类按钮 + 返回按钮事件
 */
export function initContainerPanel() {
  // 三个分类按钮
  document.querySelectorAll('.cat-btn').forEach(btn => {
    btn.addEventListener('click', () => openCategoryStats(btn.dataset.cat));
  });

  // 返回按钮：回到三分类选择页
  btnBack.addEventListener('click', () => {
    panelContainerStats.style.display = 'none';
    panelContainer.style.display      = 'block';
    // 顶部按钮：保持容器流程内（btnContainer 隐藏，btnDraw 可显示）
    btnDraw.style.display      = '';
    btnContainer.style.display = 'none';
  });
}

/**
 * 打开某分类的统计展示
 * @param {string} prefix  常规 / 机密 / 绝密
 */
function openCategoryStats(prefix) {
  const list = getStatsByPrefix(prefix);

  // 清空旧内容
  containerGrid.innerHTML = '';

  if (list.length === 0) {
    // 空状态
    containerGrid.style.display = 'none';
    emptyHint.style.display     = 'block';
    emptyHint.textContent       = `「${prefix}」分类下暂无容器记录`;
  } else {
    containerGrid.style.display = 'grid';
    emptyHint.style.display     = 'none';

    for (const { name, count } of list) {
      const cell = document.createElement('div');
      cell.className = 'container-cell';

      // 图标 canvas（与抽卡时同款绘制）
      const srcCanvas = makeItemIcon(name);
      const cv = document.createElement('canvas');
      cv.width = 100; cv.height = 100;
      cv.getContext('2d').drawImage(srcCanvas, 0, 0);

      // 右下角数量徽章
      const badge = document.createElement('div');
      badge.className   = 'count-badge';
      badge.textContent = '×' + count;

      // 名称
      const nameEl = document.createElement('div');
      nameEl.className   = 'item-name';
      nameEl.textContent = name;

      cell.appendChild(cv);
      cell.appendChild(badge);
      cell.appendChild(nameEl);
      containerGrid.appendChild(cell);
    }
  }

  // 切换面板显示（防御性：自治管理本面板涉及的所有按钮）
  panelContainer.style.display      = 'none';
  panelContainerStats.style.display = 'flex';
  btnDraw.style.display             = 'none';
  btnContainer.style.display        = 'none';
}
