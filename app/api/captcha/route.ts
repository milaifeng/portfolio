import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

// 随机文本生成（5位大写字母数字）
function generateText(length = 5) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let text = "";
  for (let i = 0; i < length; i++) {
    text += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return text;
}

// 增强噪声：线条 + 波浪曲线 + 随机点
function generateNoise(width = 150, height = 50) {
  let noise = "";

  // 1. 随机直线（8-12条）
  const lineCount = 8 + Math.floor(Math.random() * 5);
  for (let i = 0; i < lineCount; i++) {
    const x1 = Math.random() * width;
    const y1 = Math.random() * height;
    const x2 = Math.random() * width;
    const y2 = Math.random() * height;
    const opacity = 0.4 + Math.random() * 0.3;
    const color = ["#bbb", "#999", "#ccc", "#aaa"][
      Math.floor(Math.random() * 4)
    ];
    noise += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${1 + Math.random() * 1.5}" opacity="${opacity}" />`;
  }

  // 2. 波浪曲线（3-5条）
  const curveCount = 3 + Math.floor(Math.random() * 3);
  for (let i = 0; i < curveCount; i++) {
    const startX = Math.random() * width;
    const startY = Math.random() * height;
    const cp1X = Math.random() * width;
    const cp1Y = Math.random() * height;
    const cp2X = Math.random() * width;
    const cp2Y = Math.random() * height;
    const endX = Math.random() * width;
    const endY = Math.random() * height;
    const color = "#ddd";
    noise += `<path d="M${startX},${startY} C${cp1X},${cp1Y} ${cp2X},${cp2Y} ${endX},${endY}" stroke="${color}" stroke-width="1.5" fill="none" opacity="0.5" />`;
  }

  // 3. 随机点噪声（40-60个点，适配小尺寸）
  const dotCount = 40 + Math.floor(Math.random() * 20);
  for (let i = 0; i < dotCount; i++) {
    const cx = Math.random() * width;
    const cy = Math.random() * height;
    const r = 1 + Math.random() * 1.5;
    noise += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#ccc" opacity="0.6" />`;
  }

  return noise;
}

// 扭曲文本（边界安全：精确间距 + 小偏移）
function generateTextSvg(text: string, width = 150, height = 50) {
  let svg = "";
  const charCount = text.length;
  const charWidth = width / (charCount + 1.5); // 增加内边距
  const baseX = charWidth * 0.75; // 左侧内边距
  const baseY = height / 1.5; // 垂直居中偏上

  const colors = ["#1e40af", "#7c3aed", "#dc2626", "#000000", "#16a34a"];

  for (let i = 0; i < charCount; i++) {
    const char = text[i];
    // 偏移范围缩小（±3），防止出界
    const offsetX = baseX + i * charWidth + (Math.random() * 6 - 3);
    const offsetY = baseY + (Math.random() * 6 - 3);
    const rotate = Math.random() * 25 - 12.5; // -12.5 到 12.5 度
    const color = colors[Math.floor(Math.random() * colors.length)];
    svg += `<text x="${offsetX}" y="${offsetY}" font-size="38" fill="${color}" font-family="sans-serif" font-weight="bold" transform="rotate(${rotate} ${offsetX} ${offsetY})">${char}</text>`;
  }
  return svg;
}

export async function GET() {
  const session = await getSession();

  const text = generateText(4);
  const noise = generateNoise(150, 50);
  const textSvg = generateTextSvg(text, 150, 50);

  const svg = `
    <svg width="150" height="50" viewBox="0 0 150 50" xmlns="http://www.w3.org/2000/svg">
      <rect width="150" height="50" fill="#ffffff" rx="8" ry="8"/>
      <defs>
        <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
          <path d="M 8 0 L 0 0 0 8" fill="none" stroke="#f0f0f0" stroke-width="1"/>
        </pattern>
      </defs>
      <rect width="150" height="50" fill="url(#grid)" opacity="0.6"/>
      
      <!-- 噪声 -->
      ${noise}
      
      <!-- 文本 -->
      ${textSvg}
    </svg>
  `;

  // 存 session（忽略大小写）
  session.captchaText = text.toLowerCase();
  session.captchaExpire = Date.now() + 5 * 60 * 1000;
  await session.save();

  return new NextResponse(svg.trim(), {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "no-store",
    },
  });
}
