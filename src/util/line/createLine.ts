import Konva from "konva";

export const createTemporaryLine = (stage, layer, point) => {
  var arrow = new Konva.Arrow({
    x: stage.width() / 4,
    y: stage.height() / 4,
    points: [0, 0, point.x, point.y],
    pointerLength: 20,
    pointerWidth: 20,
    fill: "black",
    stroke: "black",
    strokeWidth: 4,
  });

  // add the shape to the layer
  layer.add(arrow);
};
