// js/ui/stats.js
// 容器统计数据层：按地图前缀（常规/机密/绝密）独立计数 + localStorage 持久化

const STORAGE_KEY = 'container-stats';
const PREFIXES    = ['常规', '机密', '绝密'];

// 数据结构：{ '常规': { '垃圾桶': 5, ... }, '机密': {...}, '绝密': {...} }
let stats = null;

/** 从 localStorage 读取，没有则初始化空结构 */
function loadStats() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // 校验前缀完整性，缺失时补齐
      for (const p of PREFIXES) {
        if (!parsed[p] || typeof parsed[p] !== 'object') parsed[p] = {};
      }
      return parsed;
    }
  } catch (e) {
    console.warn('[stats] localStorage 解析失败，重置为空:', e);
  }
  return { '常规': {}, '机密': {}, '绝密': {} };
}

/** 写入 localStorage */
function saveStats() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch (e) {
    console.warn('[stats] localStorage 写入失败:', e);
  }
}

/** 模块首次使用时确保已加载 */
function ensureLoaded() {
  if (stats === null) stats = loadStats();
}

/**
 * 从地图名称提取前缀（"绝密巴克十" → "绝密"）
 * @param {string} locationName
 * @returns {string|null}
 */
export function extractPrefix(locationName) {
  for (const p of PREFIXES) {
    if (locationName.startsWith(p)) return p;
  }
  return null;
}

/**
 * 记录一次容器抽取
 * @param {string} prefix         地图前缀（常规/机密/绝密）
 * @param {string} containerName  容器名称（如"垃圾桶"）
 */
export function recordContainer(prefix, containerName) {
  ensureLoaded();
  if (!PREFIXES.includes(prefix)) return;
  stats[prefix][containerName] = (stats[prefix][containerName] || 0) + 1;
  saveStats();
}

/**
 * 获取某前缀下所有已抽到的容器统计
 * @param {string} prefix
 * @returns {Array<{name: string, count: number}>}  按数量降序排列
 */
export function getStatsByPrefix(prefix) {
  ensureLoaded();
  const map = stats[prefix] || {};
  return Object.entries(map)
    .filter(([, count]) => count > 0)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

/** 清空所有统计（调试/重置用） */
export function clearAllStats() {
  stats = { '常规': {}, '机密': {}, '绝密': {} };
  saveStats();
}
