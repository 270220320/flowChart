// 计算两点之间的距离
export const computedPointLength = (p1, p2) => {
  const x = Math.abs(p1.x - p2.x);
  const y = Math.abs(p1.y - p2.y);
  return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
};

// 计算两点之间的速度
export const computedDurationByLength = (p1, p2, speed, aw) => {
  const length = computedPointLength(p1, p2);
  const duration = (speed / aw) * length;
  return duration;
};

interface Point2Item {
  x: number;
  y: number;
  duration: number;
}
export const computedDuration = (p: Array<number>, speed: number) => {
  const animLength = p.length / 2;
  let point2: Array<Point2Item> = [];
  let distance = 0; // 总长度
  for (let i = 0; i < animLength; i++) {
    const p1 = { x: p[i * 2], y: p[i * 2 + 1], duration: 1 };
    point2.push(p1);
  }
  for (let i = 0; i < point2.length; i++) {
    const p1 = point2[i];
    const p2 = point2[i + 1];
    if (p2) {
      distance += computedPointLength(p1, p2) || 0;
    }
  }
  for (let i = 0; i < point2.length; i++) {
    const p1 = point2[i - 1];
    const p2 = point2[i];
    if (!p1) {
      p2.duration = 0;
    } else {
      p2.duration = computedDurationByLength(p1, p2, speed, distance);
    }
  }
  return { point2, distance };
};
