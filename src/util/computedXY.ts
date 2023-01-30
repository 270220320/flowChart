import Konva from "konva";

export const computedXYByEvent = (canvas: Konva.Stage, event: any) => {
  let { layerX, layerY } = event as any;
  return computedXY(canvas, layerX, layerY);
};

export const computedXY = (
  canvas: Konva.Stage,
  layerX: number,
  layerY: number
) => {
  const zoom = canvas.scaleX();

  if (canvas.attrs.x || canvas.attrs.y) {
    layerX = layerX - canvas.attrs.x;
    layerY = layerY - canvas.attrs.y;
  } else if (canvas._lastPos) {
    layerX = layerX - canvas._lastPos.x;
    layerY = layerY - canvas._lastPos.y;
  }
  return {
    x: layerX / zoom,
    y: layerY / zoom,
  };
};

// 根据两点画出矩形
export const computedPoint = (
  p1: { x: number; y: number },
  p2: { x: number; y: number }
) => {
  return {
    y: p1.y,
    x: p1.x,
    width: p2.x - p1.x,
    height: p2.y - p1.y,
  };
};

// 计算点位
export default computedXY;
