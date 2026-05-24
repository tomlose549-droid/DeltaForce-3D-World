// js/ui/icons.js
// 18 种物品 Canvas 图标缓存与绘制

const S = 100;                    // 图标尺寸（像素）
const iconCache = new Map();

/**
 * 返回指定物品的 canvas 元素（缓存，首次调用时绘制）
 */
export function makeItemIcon(name) {
  if (iconCache.has(name)) return iconCache.get(name);
  const cv = document.createElement('canvas');
  cv.width = S; cv.height = S;
  drawItemIcon(cv.getContext('2d'), name);
  iconCache.set(name, cv);
  return cv;
}

// ── 工具函数 ──────────────────────────────────────────────

function bg(ctx, color = '#111') {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, S, S);
}

function roundRect(ctx, x, y, w, h, r, fill, stroke, sw = 2) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  if (fill)   { ctx.fillStyle = fill;     ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = sw; ctx.stroke(); }
}

function circle(ctx, cx, cy, r, fill, stroke, sw = 2) {
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  if (fill)   { ctx.fillStyle = fill;     ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = sw; ctx.stroke(); }
}

function text(ctx, str, x, y, size, color, align = 'center') {
  ctx.fillStyle = color;
  ctx.font = `bold ${size}px Arial`;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.fillText(str, x, y);
}

// ── 主绘制函数 ────────────────────────────────────────────

function drawItemIcon(ctx, name) {
  switch (name) {

    // ── 1. 垃圾桶 ──────────────────────────────────────────
    case '垃圾桶': {
      bg(ctx);
      // 桶身
      roundRect(ctx, 28, 34, 44, 50, 4, '#7a7a7a', '#555', 2);
      // 桶盖
      roundRect(ctx, 22, 22, 56, 14, 3, '#666', '#444', 2);
      // 提手
      ctx.strokeStyle = '#444'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(50, 20, 10, Math.PI, 0); ctx.stroke();
      // 竖条纹
      ctx.strokeStyle = '#555'; ctx.lineWidth = 1.5;
      for (let x of [38, 50, 62]) {
        ctx.beginPath(); ctx.moveTo(x, 37); ctx.lineTo(x, 82); ctx.stroke();
      }
      break;
    }

    // ── 2. 抽屉柜 ──────────────────────────────────────────
    case '抽屉柜': {
      bg(ctx);
      // 柜体
      roundRect(ctx, 18, 14, 64, 72, 3, '#5c3d2e', '#3e2519', 2);
      // 三个抽屉
      for (let i = 0; i < 3; i++) {
        const y = 18 + i * 23;
        roundRect(ctx, 22, y, 56, 19, 2, '#7a5140', '#5c3d2e', 1.5);
        // 把手
        circle(ctx, 50, y + 9.5, 3.5, '#d4a017', null);
      }
      break;
    }

    // ── 3. 手提箱 ──────────────────────────────────────────
    case '手提箱': {
      bg(ctx);
      // 箱体
      roundRect(ctx, 14, 34, 72, 50, 5, '#8B6914', '#5c4000', 2);
      // 提手
      ctx.strokeStyle = '#333'; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.roundRect(32, 18, 36, 18, 6); ctx.stroke();
      // 中央锁扣
      roundRect(ctx, 41, 56, 18, 10, 2, '#d4a017', '#a07800', 2);
      // 左右分隔线
      ctx.strokeStyle = '#5c4000'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(14, 59); ctx.lineTo(86, 59); ctx.stroke();
      break;
    }

    // ── 4. 高级旅行箱 ──────────────────────────────────────
    case '高级旅行箱': {
      bg(ctx);
      // 箱体（深蓝）
      roundRect(ctx, 16, 20, 68, 64, 6, '#1a237e', '#0d1454', 2);
      // 金色横条装饰
      for (let y of [35, 50, 65]) {
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(16, y, 68, 2);
      }
      // 提手
      ctx.strokeStyle = '#FFD700'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.roundRect(34, 10, 32, 13, 5); ctx.stroke();
      // 底部滚轮
      for (let x of [26, 74]) {
        circle(ctx, x, 88, 5, '#333', '#666', 2);
      }
      // 锁
      roundRect(ctx, 42, 46, 16, 10, 2, '#FFD700', '#c8a000', 2);
      break;
    }

    // ── 5. 电脑机箱 ──────────────────────────────────────────
    case '电脑机箱': {
      bg(ctx);
      // 机箱体
      roundRect(ctx, 22, 12, 56, 76, 4, '#2a2a2a', '#111', 2);
      // 电源按钮
      circle(ctx, 66, 24, 6, null, '#00aaff', 2);
      circle(ctx, 66, 24, 3, '#00aaff', null);
      // 光驱槽
      roundRect(ctx, 28, 38, 36, 6, 1, '#333', '#555', 1);
      roundRect(ctx, 28, 50, 36, 6, 1, '#333', '#555', 1);
      // USB 口
      for (let y of [64, 72]) {
        roundRect(ctx, 30, y, 8, 4, 1, '#444', '#666', 1);
      }
      // 散热孔排
      ctx.fillStyle = '#1a1a1a';
      for (let i = 0; i < 4; i++) {
        ctx.fillRect(68, 38 + i * 8, 6, 4);
      }
      break;
    }

    // ── 6. 武器箱 ──────────────────────────────────────────
    case '武器箱': {
      bg(ctx);
      // 箱体（军绿）
      roundRect(ctx, 12, 22, 76, 56, 4, '#3d4f1e', '#2a3512', 2);
      // 警告斜纹
      ctx.save();
      ctx.beginPath(); ctx.rect(12, 22, 76, 56); ctx.clip();
      ctx.strokeStyle = '#e6c000'; ctx.lineWidth = 5;
      for (let i = -4; i < 8; i++) {
        ctx.beginPath();
        ctx.moveTo(12 + i * 20, 22);
        ctx.lineTo(12 + i * 20 + 56, 78);
        ctx.stroke();
      }
      ctx.restore();
      // 蒙版遮住斜纹边缘
      roundRect(ctx, 12, 22, 76, 56, 4, null, '#2a3512', 3);
      // 锁扣
      roundRect(ctx, 40, 44, 20, 12, 3, '#666', '#444', 2);
      circle(ctx, 50, 50, 3.5, '#888', '#555', 1);
      break;
    }

    // ── 7. 航空储物箱 ──────────────────────────────────────
    case '航空储物箱': {
      bg(ctx);
      // 箱体（铝灰）
      roundRect(ctx, 10, 30, 80, 40, 8, '#b0b8c0', '#7a8590', 2);
      // 顶部高光
      ctx.fillStyle = 'rgba(255,255,255,0.18)';
      ctx.beginPath(); ctx.roundRect(10, 30, 80, 16, [8, 8, 0, 0]); ctx.fill();
      // 侧面锁扣
      for (let x of [18, 72]) {
        roundRect(ctx, x, 44, 10, 12, 2, '#888', '#555', 2);
      }
      // 提手
      ctx.strokeStyle = '#666'; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.roundRect(35, 18, 30, 14, 5); ctx.stroke();
      // 品牌条纹（蓝）
      ctx.fillStyle = '#1565C0';
      ctx.fillRect(10, 52, 80, 4);
      break;
    }

    // ── 8. 快递箱 ──────────────────────────────────────────
    case '快递箱': {
      bg(ctx);
      // 纸板箱体（瓦楞纸色）
      roundRect(ctx, 16, 22, 68, 60, 3, '#c8a96e', '#9a7a44', 2);
      // 顶部折盖分缝
      ctx.strokeStyle = '#9a7a44'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(50, 22); ctx.lineTo(50, 42); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(16, 38); ctx.lineTo(84, 38); ctx.stroke();
      // 胶带（褐色）
      ctx.fillStyle = '#a0784a';
      ctx.fillRect(44, 22, 12, 60);
      ctx.fillRect(16, 36, 68, 6);
      // 阴影线（纸板纹路）
      ctx.strokeStyle = 'rgba(0,0,0,0.18)'; ctx.lineWidth = 1;
      for (let y = 48; y < 82; y += 7) {
        ctx.beginPath(); ctx.moveTo(16, y); ctx.lineTo(84, y); ctx.stroke();
      }
      break;
    }

    // ── 9. 医疗物资堆 ──────────────────────────────────────
    case '医疗物资堆': {
      bg(ctx);
      // 底层箱（白）
      roundRect(ctx, 10, 52, 50, 32, 3, '#e8e8e8', '#bbb', 2);
      // 红十字
      ctx.fillStyle = '#dd0000';
      ctx.fillRect(22, 60, 26, 8);
      ctx.fillRect(30, 54, 10, 20);
      // 中层箱
      roundRect(ctx, 40, 38, 46, 28, 3, '#eee', '#bbb', 2);
      ctx.fillStyle = '#dd0000';
      ctx.fillRect(50, 44, 18, 6);
      ctx.fillRect(56, 40, 6, 14);
      // 顶层小箱
      roundRect(ctx, 52, 24, 32, 18, 2, '#f5f5f5', '#ccc', 2);
      break;
    }

    // ── 10. 电脑 ──────────────────────────────────────────
    case '电脑': {
      bg(ctx);
      // 屏幕外框
      roundRect(ctx, 14, 14, 72, 50, 4, '#1a1a1a', '#333', 2);
      // 屏幕内容（蓝光）
      roundRect(ctx, 18, 18, 64, 42, 2, '#0a1a2e', null);
      // 屏幕发光效果
      ctx.fillStyle = 'rgba(0,120,255,0.15)';
      ctx.fillRect(18, 18, 64, 42);
      // 系统界面模拟（几条彩色线）
      const cols = ['#0af', '#0f8', '#fa0', '#f44'];
      cols.forEach((c, i) => {
        ctx.fillStyle = c;
        ctx.fillRect(22, 26 + i * 8, 20 + Math.random() * 20 | 0, 4);
      });
      // 底座支撑
      roundRect(ctx, 38, 64, 24, 6, 2, '#333', '#555', 2);
      // 底座底板
      roundRect(ctx, 28, 70, 44, 5, 2, '#2a2a2a', '#444', 2);
      break;
    }

    // ── 11. 小保险箱 ──────────────────────────────────────
    case '小保险箱': {
      bg(ctx);
      // 箱体
      roundRect(ctx, 20, 20, 60, 60, 4, '#2e2e2e', '#111', 3);
      // 表盘外圈
      circle(ctx, 50, 50, 18, '#444', '#666', 2);
      // 刻度
      ctx.strokeStyle = '#888'; ctx.lineWidth = 1.5;
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(50 + Math.cos(a) * 13, 50 + Math.sin(a) * 13);
        ctx.lineTo(50 + Math.cos(a) * 17, 50 + Math.sin(a) * 17);
        ctx.stroke();
      }
      // 表盘中心
      circle(ctx, 50, 50, 5, '#777', '#555', 1);
      // 指针
      ctx.strokeStyle = '#ccc'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(50, 50); ctx.lineTo(58, 44); ctx.stroke();
      // 把手
      roundRect(ctx, 68, 44, 7, 12, 2, '#555', '#777', 2);
      break;
    }

    // ── 12. 服务器 ──────────────────────────────────────────
    case '服务器': {
      bg(ctx, '#0a0a0a');
      // 机架主体
      roundRect(ctx, 14, 10, 72, 80, 3, '#111', '#2a2a2a', 2);
      // 5个机架单元
      for (let i = 0; i < 5; i++) {
        const y = 14 + i * 15;
        roundRect(ctx, 18, y, 64, 12, 2, '#1a1a1a', '#333', 1);
        // 单元状态灯
        const ledColor = i === 2 ? '#ff4400' : '#00dd00';
        circle(ctx, 26, y + 6, 3, ledColor, null);
        // 单元槽口
        roundRect(ctx, 34, y + 3, 36, 6, 1, '#0d0d0d', '#2a2a2a', 1);
      }
      break;
    }

    // ── 13. 大保险箱 ──────────────────────────────────────
    case '大保险箱': {
      bg(ctx);
      // 箱体（更大更厚重）
      roundRect(ctx, 12, 12, 68, 76, 5, '#252525', '#111', 3);
      // 门缝
      ctx.strokeStyle = '#111'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(58, 12); ctx.lineTo(58, 88); ctx.stroke();
      // 大表盘
      circle(ctx, 36, 50, 20, '#3a3a3a', '#555', 2);
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2;
        ctx.strokeStyle = '#777'; ctx.lineWidth = i % 3 === 0 ? 2 : 1;
        ctx.beginPath();
        ctx.moveTo(36 + Math.cos(a) * 14, 50 + Math.sin(a) * 14);
        ctx.lineTo(36 + Math.cos(a) * 19, 50 + Math.sin(a) * 19);
        ctx.stroke();
      }
      circle(ctx, 36, 50, 5, '#888', '#666', 1);
      ctx.strokeStyle = '#aaa'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(36, 50); ctx.lineTo(44, 40); ctx.stroke();
      // 把手
      roundRect(ctx, 62, 40, 10, 20, 3, '#444', '#666', 2);
      break;
    }

    // ── 14. 鸟窝 ──────────────────────────────────────────
    case '鸟窝': {
      bg(ctx);
      // 巢体（深棕椭圆）
      ctx.fillStyle = '#5c3a0a';
      ctx.beginPath();
      ctx.ellipse(50, 66, 36, 20, 0, 0, Math.PI * 2);
      ctx.fill();
      // 巢内部（凹陷）
      ctx.fillStyle = '#3d2508';
      ctx.beginPath();
      ctx.ellipse(50, 62, 26, 14, 0, 0, Math.PI * 2);
      ctx.fill();
      // 树枝纹路
      ctx.strokeStyle = '#7a5020'; ctx.lineWidth = 2;
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI + Math.PI * 0.1;
        ctx.beginPath();
        ctx.moveTo(50 + Math.cos(a) * 34, 66 + Math.sin(a) * 18);
        ctx.quadraticCurveTo(50, 55, 50 - Math.cos(a) * 28, 66 - Math.sin(a) * 14);
        ctx.stroke();
      }
      // 蛋（3颗）
      const eggs = [[-10, 0], [0, -3], [10, 0]];
      eggs.forEach(([dx, dy]) => {
        ctx.fillStyle = '#d4c89a';
        ctx.beginPath();
        ctx.ellipse(50 + dx, 60 + dy, 7, 9, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#b8aa7a'; ctx.lineWidth = 1;
        ctx.stroke();
      });
      break;
    }

    // ── 15. 火箭返回舱 ────────────────────────────────────
    case '火箭返回舱': {
      bg(ctx);
      // 舱体（锥形）
      ctx.fillStyle = '#b0b8c4';
      ctx.beginPath();
      ctx.moveTo(50, 10);
      ctx.lineTo(72, 68);
      ctx.lineTo(28, 68);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#7a8590'; ctx.lineWidth = 2; ctx.stroke();
      // 高光
      ctx.fillStyle = 'rgba(255,255,255,0.18)';
      ctx.beginPath();
      ctx.moveTo(50, 10); ctx.lineTo(60, 68); ctx.lineTo(50, 68);
      ctx.closePath(); ctx.fill();
      // 舷窗
      circle(ctx, 50, 42, 10, '#1a2a3a', '#0af', 2);
      circle(ctx, 50, 42, 5, '#0a3050', null);
      // 隔热板（底部黑色）
      roundRect(ctx, 22, 68, 56, 12, 3, '#111', '#333', 2);
      // 着陆腿
      ctx.strokeStyle = '#777'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(28, 72); ctx.lineTo(16, 88); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(72, 72); ctx.lineTo(84, 88); ctx.stroke();
      break;
    }

    // ── 16. 沙色大保险 ────────────────────────────────────
    case '沙色大保险': {
      bg(ctx, '#1a1408');
      // 箱体（沙漠色）
      roundRect(ctx, 12, 12, 68, 76, 5, '#c2955d', '#9a7040', 3);
      // 门缝
      ctx.strokeStyle = '#9a7040'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(58, 12); ctx.lineTo(58, 88); ctx.stroke();
      // 表盘
      circle(ctx, 36, 50, 20, '#b0854a', '#8a6030', 2);
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2;
        ctx.strokeStyle = '#d4a870'; ctx.lineWidth = i % 3 === 0 ? 2 : 1;
        ctx.beginPath();
        ctx.moveTo(36 + Math.cos(a) * 14, 50 + Math.sin(a) * 14);
        ctx.lineTo(36 + Math.cos(a) * 19, 50 + Math.sin(a) * 19);
        ctx.stroke();
      }
      circle(ctx, 36, 50, 5, '#d4a870', '#a07840', 1);
      ctx.strokeStyle = '#f0c890'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(36, 50); ctx.lineTo(44, 40); ctx.stroke();
      // 把手
      roundRect(ctx, 62, 40, 10, 20, 3, '#a07840', '#c09060', 2);
      // 沙漠风化纹路
      ctx.strokeStyle = 'rgba(0,0,0,0.12)'; ctx.lineWidth = 1;
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(12, 20 + i * 14);
        ctx.lineTo(80, 22 + i * 14);
        ctx.stroke();
      }
      break;
    }

    // ── 17. 三角蚌 ────────────────────────────────────────
    case '三角蚌': {
      bg(ctx, '#0a0a18');
      // 壳体（紫蓝三角形）
      const grad = ctx.createLinearGradient(50, 14, 50, 86);
      grad.addColorStop(0, '#7c4dff');
      grad.addColorStop(1, '#1a237e');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(50, 14);
      ctx.lineTo(86, 82);
      ctx.lineTo(14, 82);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#b39ddb'; ctx.lineWidth = 2; ctx.stroke();
      // 贝壳纹路（同心三角形）
      ctx.strokeStyle = 'rgba(179,157,219,0.4)'; ctx.lineWidth = 1;
      for (let s = 0.75; s > 0.2; s -= 0.18) {
        const cx = 50, cy = 14 + (82 - 14) * (1 - s);
        const hw = 36 * s, bot = 82 - (82 - 14) * (1 - s);
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + hw * 2, bot);
        ctx.lineTo(cx - hw * 2, bot);
        ctx.closePath();
        ctx.stroke();
      }
      // 珍珠光泽
      ctx.fillStyle = 'rgba(255,255,255,0.14)';
      ctx.beginPath();
      ctx.moveTo(50, 14); ctx.lineTo(70, 82); ctx.lineTo(50, 82);
      ctx.closePath(); ctx.fill();
      break;
    }

    // ── 18. 典狱长的审判 ──────────────────────────────────
    case '典狱长的审判': {
      bg(ctx, '#0a0000');
      // 法槌头部
      ctx.fillStyle = '#8B0000';
      roundRect(ctx, 24, 20, 52, 28, 4, '#8B0000', '#600000', 3);
      // 金色箍环
      ctx.fillStyle = '#FFD700';
      ctx.fillRect(24, 28, 52, 5);
      ctx.fillRect(24, 35, 52, 5);
      // 木槌柄（深棕）
      roundRect(ctx, 44, 46, 12, 44, 4, '#5c3000', '#3e2000', 2);
      // 柄末端
      roundRect(ctx, 40, 86, 20, 8, 3, '#4a2800', '#2e1800', 2);
      // 顶部金色标志
      ctx.fillStyle = '#FFD700';
      ctx.font = 'bold 18px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('⚖', 50, 34);
      break;
    }

    // 未知物品兜底
    default: {
      bg(ctx, '#1a1a1a');
      text(ctx, '?', S / 2, S / 2, 48, '#888');
      break;
    }
  }
}
