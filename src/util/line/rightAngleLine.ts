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
