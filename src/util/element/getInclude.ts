import Konva from "konva";
import layer from "../layer";

export const getInclude = (stage: Konva.Stage, rect: Konva.Rect) => {
  const arr = [];
  const lay = layer(stage, "thing");
  lay.children.forEach((node) => {
    const area = node.getClientRect();
    const points = [
      {
        x: area.x,
        y: area.y,
      },
      {
        x: area.x + area.width,
        y: area.y,
      },
      {
        x: area.x + area.width,
        y: area.y + area.height,
      },
      {
        x: area.x,
        y: area.y + area.height,
      },
    ];
    if (
      rect.intersects(points[0]) &&
      rect.intersects(points[1]) &&
      rect.intersects(points[2]) &&
      rect.intersects(points[3])
    ) {
      arr.push(node);
    }
  });
  return arr;
};
