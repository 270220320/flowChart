import Konva from "konva";
import layer from "../layer";
import INLEDITOR from "../../";

export const getInclude = (ie: INLEDITOR, rect: Konva.Rect) => {
  const rectTem = rect;
  const arr = [];
  ie.thingLayer.children.forEach((node) => {
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
      rectTem &&
      rectTem.intersects(points[0]) &&
      rectTem.intersects(points[1]) &&
      rectTem.intersects(points[2]) &&
      rectTem.intersects(points[3])
    ) {
      // if (node.name() !== "field") {
      arr.push(node);
      // }
    }
  });
  return arr;
};
