import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";

// 直线首末点赋值并修改相邻点坐标保持直角
export const setRightAngleLineBeginOrEnd = (
  points: { x: number; y: number }[],
  index: number,
  target: { x: number; y: number }
) => {
  let now;
  if (index === 0) {
    now = points[0];
    const next = points[1];
    // 横线
    if (now.y === next.y) {
      next.y = target.y;
      // 竖线
    } else if (now.x === next.x) {
      next.x = target.x;
    }
    now.x = target.x;
    now.y = target.y;
  } else if (index === points.length - 1) {
    now = points[index];
    const prev = points[index - 1];
    // 横线
    if (now.y === prev.y) {
      prev.y = target.y;
      // 竖线
    } else if (now.x === prev.x) {
      prev.x = target.x;
    }
    now.x = target.x;
    now.y = target.y;
  }
  return points;
};

export const getLinePoints = (
  pointA: { x: number; y: number },
  pointB: { x: number; y: number }
) => {
  const arr = [pointA];
  if (Math.abs(pointB.x - pointA.x) >= Math.abs(pointB.y - pointA.y)) {
    // X轴距离大,三折线
    const point1 = { x: (pointA.x + pointB.x) / 2, y: pointA.y };
    const point2 = { x: (pointA.x + pointB.x) / 2, y: pointB.y };
    arr.push(point1, point2);
  } else {
    const point1 = { y: (pointA.y + pointB.y) / 2, x: pointA.x };
    const point2 = { y: (pointA.y + pointB.y) / 2, x: pointB.x };
    arr.push(point1, point2);
    // Y轴距离大,二折线
    // const point1 = { x: pointA.x, y: pointB.y };
    // arr.push(point1);
  }
  arr.push(pointB);
  return arr;
};
