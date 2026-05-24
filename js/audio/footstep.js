// js/audio/footstep.js
// 室内硬地板脚步音效：左右脚交替，带回响

let audioCtx   = null;
let stepTimer  = 0;
let isLeftFoot = true;

const getACtx = () => {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
};

function playFootstep(isLeft) {
  const ctx = getACtx();
  const sr  = ctx.sampleRate;

  // 冲击噪声（极快衰减模拟硬地板撞击）
  const impLen = Math.floor(sr * 0.045);
  const buf    = ctx.createBuffer(1, impLen, sr);
  const d      = buf.getChannelData(0);
  for (let i = 0; i < impLen; i++) {
    d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / impLen, 14);
  }

  const src = ctx.createBufferSource();
  src.buffer = buf;

  // 带通滤波：突出大理石地板清脆频段，左右脚略有不同
  const bp = ctx.createBiquadFilter();
  bp.type            = 'bandpass';
  bp.frequency.value = isLeft ? 1900 : 2300;
  bp.Q.value         = 1.4;

  // 高通：去除低频轰鸣
  const hp = ctx.createBiquadFilter();
  hp.type            = 'highpass';
  hp.frequency.value = 700;

  // 短延迟模拟室内硬墙回响
  const delay = ctx.createDelay(0.15);
  delay.delayTime.value = isLeft ? 0.032 : 0.038;

  const echoGain = ctx.createGain();
  echoGain.gain.value = 0.18;

  const master = ctx.createGain();
  master.gain.value = 0.52;

  // 直达声路径
  src.connect(hp); hp.connect(bp); bp.connect(master);
  // 回响路径
  bp.connect(delay); delay.connect(echoGain); echoGain.connect(master);
  master.connect(ctx.destination);
  src.start();
}

/**
 * 每帧调用
 * @param {number}   dt         帧时间（秒）
 * @param {function} isMovingFn 是否正在移动（返回 boolean）
 * @param {function} isShiftFn  是否按下 Shift（返回 boolean）
 */
export function updateFootstep(dt, isMovingFn, isShiftFn) {
  if (!isMovingFn()) { stepTimer = 0; isLeftFoot = true; return; }
  const interval = isShiftFn() ? 1 / 3 : 1 / 1.5;
  stepTimer += dt;
  if (stepTimer >= interval) {
    stepTimer -= interval;
    playFootstep(isLeftFoot);
    isLeftFoot = !isLeftFoot;
  }
}
