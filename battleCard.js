import { createCanvas, loadImage } from 'canvas';
import fs from 'fs';
import path from 'path';

export async function drawBattleCard(ownChar, Enemy) {
  const width = 560;
  const height = 320;
  const imgWidth = 160;
  const imgHeight = 220;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Load images
  const leftImg = await loadImage(path.resolve('img', `${ownChar.img}`));  // ownChar image
  const rightImg = await loadImage(path.resolve('img', `${Enemy.img}`)); // enemyChar image

  ctx.drawImage(leftImg, 0, 0, imgWidth, imgHeight);
  ctx.drawImage(rightImg, width - imgWidth, 0, imgWidth, imgHeight);

  // Compute stats percentages
  const leftStats = {
    hp: ownChar.Vit / ownChar.maxVit,
    mana: ownChar.Mp / ownChar.maxMp,
    posture: ownChar.Post / ownChar.maxPost,
  };

  const rightStats = {
    hp: Enemy.Vit / Enemy.maxVit,
    mana: Enemy.Mp / Enemy.maxMp,
    posture: Enemy.Post / Enemy.maxPost,
  };

  // Draw bars
drawBars(ctx, 0, imgHeight + 5, imgWidth, 10, leftStats);
drawBars(ctx, width - imgWidth, imgHeight + 5, imgWidth, 10, rightStats);

  // Return buffer for Discord
  return canvas.toBuffer('image/png');
}

function drawBars(ctx, x, y, width, height, stats) {
  drawBar(ctx, x, y, width, height, 'red', stats.hp);
  drawBar(ctx, x, y + height + 2, width, height, 'lightblue', stats.mana);
  drawBar(ctx, x, y + (height + 2) * 2, width, height, 'lightgreen', stats.posture);
}

function drawBar(ctx, x, y, width, height, color, percent, text) {
  // Draw background
  ctx.fillStyle = '#222';
  ctx.fillRect(x, y, width, height);

  // Draw filled portion
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width * percent, height);

  // Reset shadow for next bar
  ctx.shadowColor = 'transparent';
}






/*

const leftLabels = {
  hp: ownChar.Vit,
  maxHp: ownChar.maxVit,
  mana: ownChar.Mp,
  maxMana: ownChar.maxMp,
  posture: ownChar.Post,
  maxPosture: ownChar.maxPost
};

const rightLabels = {
  hp: Enemy.Vit,
  maxHp: Enemy.maxVit,
  mana: Enemy.Mp,
  maxMana: Enemy.maxMp,
  posture: Enemy.Post,
  maxPosture: Enemy.maxPost
};

  // Draw bars
drawBars(ctx, 0, imgHeight + 5, imgWidth, 10, leftStats, leftLabels);
drawBars(ctx, width - imgWidth, imgHeight + 5, imgWidth, 10, rightStats, rightLabels);

function drawBars(ctx, x, y, width, height, stats, labels) {
  drawBar(ctx, x, y, width, height, 'red', stats.hp, `${labels.hp}/${labels.maxHp}`);
  drawBar(ctx, x, y + height + 2, width, height, 'lightblue', stats.mana, `${labels.mana}/${labels.maxMana}`);
  drawBar(ctx, x, y + (height + 2) * 2, width, height, 'lightgreen', stats.posture, `${labels.posture}/${labels.maxPosture}`);
}

function drawBar(ctx, x, y, width, height, color, percent, text) {
  // Draw background
  ctx.fillStyle = '#222';
  ctx.fillRect(x, y, width, height);

  // Draw filled portion
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width * percent, height);

  // Draw text
  ctx.font = `${height - 2}px sans-serif`;   // font slightly smaller than bar height
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Shadow for readability
  ctx.shadowColor = 'black';
  ctx.shadowOffsetX = 1;
  ctx.shadowOffsetY = 1;
  ctx.shadowBlur = 2;

  // Center text inside bar
  ctx.fillText(text, x + width / 2, y + height / 2);

  // Reset shadow for next bar
  ctx.shadowColor = 'transparent';
}

*/