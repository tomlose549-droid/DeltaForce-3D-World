// js/ui/panel-shipping.js
// 集装箱开箱面板：生成箱子、点击抽取物品、✓ 返回抽卡面板

import { getLocationData, weightedRandom } from './loot.js';
import { makeItemIcon }                    from './icons.js';

// ── DOM 引用 ───────────────────────────────────────────────
const panelShipping = document.getElementById('panel-shipping');
const shippingRow   = document.getElementById('shipping-row');
const btnConfirm    = document.getElementById('btn-confirm-ship');
const panelDraw     = document.getElementById('panel-draw');
const btnDraw       = document.getElementById('btn-draw');
const btnContainer  = document.getElementById('btn-container');

// ── 初始化：绑定 ✓ 按钮事件 ────────────────────────────────
export function initShippingPanel() {
  btnConfirm.addEventListener('click', () => {
    panelShipping.style.display = 'none';
    panelDraw.style.display     = 'block';
    btnContainer.style.display  = '';
    // btnDraw 保持隐藏（依然在抽卡流程内）
  });
}

// ── 打开集装箱面板 ─────────────────────────────────────────
export function openShippingPanel(locationName) {
  const locData = getLocationData()[locationName];
  if (!locData) return;

  // 按 countTable 随机决定本次箱子数量
  const count = pickCount(locData.countTable);

  // 清空上一次结果
  shippingRow.innerHTML = '';

  // 生成集装箱格子
  for (let i = 0; i < count; i++) {
    const slot = document.createElement('div');
    slot.className = 'crate-slot';

    const btn = document.createElement('button');
    btn.className = 'crate-btn';
    btn.addEventListener('click', () => openCrate(btn, slot, locData.lootTable));

    slot.appendChild(btn);
    shippingRow.appendChild(slot);
  }

  // 切换面板显示（防御性：显式管理本面板涉及的所有按钮，不依赖外部调用链）
  panelDraw.style.display     = 'none';
  panelShipping.style.display = 'flex';
  btnDraw.style.display       = 'none'; // 防御性隐藏（正常流程下已隐藏，此处保证自治）
  btnContainer.style.display  = 'none'; // 开箱中暂时隐藏顶部容器按钮
}

// ── 点击集装箱：抽取物品并展示 ────────────────────────────
function openCrate(btn, slot, lootTable) {
  // 防止重复点击
  if (btn.disabled) return;
  btn.disabled = true;

  // 加权随机抽取物品
  const itemName = weightedRandom(lootTable);

  // 从缓存取图标（makeItemIcon 内部有 Map 缓存，不重复绘制）
  const srcCanvas = makeItemIcon(itemName);

  // 克隆一份新 canvas（缓存的 canvas 不能直接挂进 DOM 多次）
  const cv = document.createElement('canvas');
  cv.width = 100; cv.height = 100;
  cv.getContext('2d').drawImage(srcCanvas, 0, 0);

  // 物品名称标签
  const nameEl = document.createElement('div');
  nameEl.className = 'item-name';
  nameEl.textContent = itemName;

  // 组装物品槽
  const itemSlot = document.createElement('div');
  itemSlot.className = 'item-slot';
  itemSlot.appendChild(cv);
  itemSlot.appendChild(nameEl);

  // 隐藏集装箱按钮，展示物品
  btn.style.display = 'none';
  slot.appendChild(itemSlot);
}

// ── 工具：按 countTable 加权随机取数量 ────────────────────
function pickCount(countTable) {
  const total = countTable.reduce((s, e) => s + e.weight, 0);
  let r = Math.random() * total;
  for (const e of countTable) {
    r -= e.weight;
    if (r <= 0) return e.count;
  }
  return countTable[countTable.length - 1].count;
}
