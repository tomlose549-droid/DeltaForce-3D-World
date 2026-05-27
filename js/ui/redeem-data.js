// js/ui/redeem-data.js
// 兑换码数据层：从 JSON 加载 + 安全网降级 + 规则匹配
// 支持规则：unlimited（无限次）/ once（一次性）/ 数字 N（限 N 次）/ expireAt（限时）

// ── 备用兜底（fetch 失败时自动启用，至少保证「容器自由」可用）─────────
const FALLBACK_CODES = {
  '容器自由': {
    rewards: [
      { prefix: '绝密', name: '典狱长的审判', count: 10 },
      { prefix: '绝密', name: '沙色大保险',   count: 10 },
      { prefix: '绝密', name: '大保险箱',     count: 10 },
    ],
    limit: 'unlimited',
  },
};

const USAGE_STORAGE_KEY = 'redeem-usage';

let CODES = null;
let _loadFailed = false;

// ── JSON 加载 ─────────────────────────────────────────────────────────
export async function loadRedeemCodes() {
  try {
    const res = await fetch('./data/redeem-codes.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    CODES = await res.json();
    _loadFailed = false;
  } catch (e) {
    console.warn('[redeem-data] 兑换码 JSON 加载失败，使用备用配置:', e);
    CODES = FALLBACK_CODES;
    _loadFailed = true;
  }
}

/** 加载是否失败（供 UI 决定是否显示 toast 提示）*/
export const isLoadFailed = () => _loadFailed;

// ── 验证结果类型 ──────────────────────────────────────────────────────
export const ResultType = {
  SUCCESS:     'success',     // 兑换成功
  INVALID:     'invalid',     // 兑换码不存在
  EXPIRED:     'expired',     // 已过期
  USED_UP:     'used_up',     // 已用完（once 或 N 次到达上限）
};

// ── 使用次数读写 ──────────────────────────────────────────────────────
function loadUsage() {
  try {
    const raw = localStorage.getItem(USAGE_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveUsage(usage) {
  try {
    localStorage.setItem(USAGE_STORAGE_KEY, JSON.stringify(usage));
  } catch (e) {
    console.warn('[redeem-data] 使用次数写入 localStorage 失败:', e);
  }
}

// ── 核心：验证 + 消费 + 返回奖励 ──────────────────────────────────────
/**
 * 尝试兑换某个码（验证 + 增计数 + 返回奖励列表）
 * @param {string} rawInput 用户输入（自动 trim）
 * @returns {{ type: string, rewards?: Array, message?: string }}
 */
export function redeem(rawInput) {
  if (!CODES) return { type: ResultType.INVALID };

  const code = (rawInput || '').trim();
  const config = CODES[code];
  if (!config) return { type: ResultType.INVALID };

  // 1. 检查过期时间
  if (config.expireAt) {
    const expireTime = new Date(config.expireAt).getTime();
    if (!isNaN(expireTime) && Date.now() > expireTime) {
      return { type: ResultType.EXPIRED };
    }
  }

  // 2. 检查使用次数
  const usage = loadUsage();
  const usedCount = usage[code] || 0;

  if (config.limit === 'unlimited') {
    // 无限制 → 直接通过
  } else if (config.limit === 'once') {
    if (usedCount >= 1) return { type: ResultType.USED_UP };
  } else if (typeof config.limit === 'number') {
    if (usedCount >= config.limit) return { type: ResultType.USED_UP };
  } else {
    // 配置未定义 limit → 默认按 unlimited 处理
  }

  // 3. 记录使用次数（仅限制类型需要记录）
  if (config.limit === 'once' || typeof config.limit === 'number') {
    usage[code] = usedCount + 1;
    saveUsage(usage);
  }

  // 4. 返回奖励
  return {
    type: ResultType.SUCCESS,
    rewards: config.rewards || [],
  };
}

/** 调试用：清空使用次数（供未来设置面板调用）*/
export function clearAllUsage() {
  saveUsage({});
}
