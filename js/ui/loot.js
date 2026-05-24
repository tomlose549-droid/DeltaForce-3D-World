// js/ui/loot.js
// 战利品数据加载 + 加权随机算法

let LOCATION_DATA = null;

/**
 * 异步加载 data/loot-tables.json
 * 在 main.js 初始化时调用一次
 */
export async function loadLootData() {
  const res = await fetch('./data/loot-tables.json');
  LOCATION_DATA = await res.json();
}

/** 返回已加载的地点数据对象 */
export function getLocationData() {
  return LOCATION_DATA;
}

/**
 * 加权随机：从 [{name, weight}, ...] 中按权重随机取一项
 * 自动归一化，无需权重总和精确等于 100
 */
export function weightedRandom(table) {
  const total = table.reduce((s, e) => s + e.weight, 0);
  let r = Math.random() * total;
  for (const entry of table) {
    r -= entry.weight;
    if (r <= 0) return entry.name;
  }
  return table[table.length - 1].name;
}
