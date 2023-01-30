import Konva from "konva";

export const createTemporaryLine = (
  layer: Konva.Layer,
  point: { x: number; y: number }
) => {
  var arrow = new Konva.Arrow({
    points: [point.x, point.y, point.x, point.y],
    pointerLength: 20,
    pointerWidth: 20,
    fill: "black",
    stroke: "black",
    strokeWidth: 4,
  });

  layer.add(arrow);
  return arrow;
};
