import Konva from "konva";

export const movePartOfLine = (
  points: { x: number; y: number }[],
  clickIndex: number,
  point: { x: number; y: number }
) => {
  const prev = points![clickIndex - 1];
  const next = points![clickIndex];

  // 横线
  if (prev.y === next.y) {
    // 首节点需加点
    if (clickIndex === 1) {
      points?.splice(clickIndex, 0, {
        x: prev.x,
        y: point.y,
      });
      clickIndex = 2;
    } else {
      prev.y = point.y;
    }
    // 尾节点需加点
    if (clickIndex === points!.length - 1) {
      points?.splice(clickIndex, 0, {
        x: next.x,
        y: point.y,
      });
    } else {
      next.y = point.y;
    }
  }
  // 竖线
  if (prev.x === next.x) {
    // 首节点需加点
    if (clickIndex === 1) {
      points?.splice(clickIndex, 0, {
        x: point.x,
        y: prev.y,
      });
      clickIndex = 2;
    } else {
      prev.x = point.x;
    }
    // 尾节点需加点
    if (clickIndex === points!.length - 1) {
      points?.splice(clickIndex, 0, {
        x: point.x,
        y: next.y,
      });
    } else {
      next.x = point.x;
    }
  }
  return points;
};

// 获取点应该添加到的下标
export const getInsertIndex = (
  points: { x: number; y: number }[],
  point: { x: number; y: number }
) => {
  let index = 0;
  let distance: number | undefined = undefined;
  // 两点之前直线最短
  for (let i: number = 0; i <= points!.length - 2; i++) {
    const point1 = points![i];
    const point2 = points![i + 1];
    const num =
      Math.sqrt(
        Math.pow(point.x - point1.x, 2) + Math.pow(point.y - point1.y, 2)
      ) +
      Math.sqrt(
        Math.pow(point.x - point2.x, 2) + Math.pow(point.y - point2.y, 2)
      ) -
      Math.sqrt(
        Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2)
      );
    if (distance === undefined || num < distance) {
      distance = num;
      index = i;
    }
  }
  return index + 1;
};
