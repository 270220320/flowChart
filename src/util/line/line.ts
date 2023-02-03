// 根据konva点转换正常点
export const getUsePoint: (
  p: Array<number>,
  i?: number
) => Array<{
  x: number;
  y: number;
}> = (p, i) => {
  const l = p.length;
  if (l % 2 !== 0) {
    console.warn("非原始点");
    return [];
  }
  const usePoint: Array<{
    x: number;
    y: number;
  }> = [];
  for (let i = 0; i < l / 2; i++) {
    const p1 = { x: p[i * 2], y: p[i * 2 + 1], i };
    usePoint.push(p1);
  }
  if (i === 0 || i) {
    return [usePoint[i]];
  }
  return usePoint;
};

// 根据正常点转konva点
export const getUsePointUn: (
  p: Array<{
    x: number;
    y: number;
  }>
) => Array<number> = (p) => {
  const arr: Array<number> = [];
  for (let i of p) {
    arr.push(i.x, i.y);
  }
  return arr;
};
