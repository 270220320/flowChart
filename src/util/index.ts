import Konva from "konva";
import INLEDITOR from "..";
import layer from "./layer";

export const getMouseOver = (
  point: { x: number; y: number },
  stage: Konva.Stage
) => {
  return layer(stage, "thing").getIntersection(point);
};
