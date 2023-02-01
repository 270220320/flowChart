import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { getCustomAttrs } from "../customAttr";

export const dealRelation = (e: KonvaEventObject<any>, stage: Konva.Stage) => {
  debugger;
  if (e.target.className === "Rect") {
    const { lineInfo } = getCustomAttrs(e.target);
    lineInfo.outLineIds?.forEach((lineId: string) => {
      const line = stage.findOne("#" + lineId);
      const { lineInfo } = getCustomAttrs(line);
      const x = e.target.attrs.x + lineInfo.fromExcursionX;
      const y = e.target.attrs.y + lineInfo.fromExcursionY;

      // if (line.data.type === "rightAngle") {
      //   setRightAngleLineBeginOrEnd(line.points!, 0, { x, y });
      // } else {
      line.attrs.points[0] = x;
      line.attrs.points[1] = y;
      line.setAttrs({ points: line.attrs.points });
      // }
    });
    lineInfo.inLineIds?.forEach((lineId: string) => {
      const line = stage.findOne("#" + lineId);
      const { lineInfo } = getCustomAttrs(line);
      const x = e.target.attrs.x + lineInfo.toExcursionX;
      const y = e.target.attrs.y + lineInfo.toExcursionY;

      // if (line.data.type === "rightAngle") {
      //   setRightAngleLineBeginOrEnd(line.points!, 0, { x, y });
      // } else {
      line.attrs.points[line.attrs.points.length - 2] = x;
      line.attrs.points[line.attrs.points.length - 1] = y;
      line.setAttrs({ points: line.attrs.points });
      // }
    });
  }
};
