import Konva from "konva";
import INLEDITOR from "..";
import layer from "./layer";

export const getMouseOver = (
  point: { x: number; y: number },
  ie: INLEDITOR
) => {
  return (
    layer(ie, "shape").getIntersection(point) ||
    layer(ie, "thing").getIntersection(point)
  );
};
