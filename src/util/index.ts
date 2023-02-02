import INLEDITOR from "..";
import layer from "./layer";

export const getMouseOver = (
  point: { x: number; y: number },
  ie: INLEDITOR
) => {
  return layer(ie.stage, "thing").getIntersection(point);
};
