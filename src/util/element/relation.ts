import Konva from "konva";
import INLEDITOR from "src";
import { KonvaEventObject } from "konva/lib/Node";
import { getCustomAttrs } from "../customAttr";
import { getUsePoint, getUsePointUn } from "../line/line";
import { setRightAngleLineBeginOrEnd } from "../line/rightAngleLine";

export const dealRelation = (e: KonvaEventObject<any>, ie: INLEDITOR) => {
  if (e.target.className === "Rect") {
    const { lineInfo } = getCustomAttrs(e.target);
    lineInfo.outLineIds?.forEach((lineId: string) => {
      const line = ie.stage.findOne("#" + lineId);
      const { lineInfo } = getCustomAttrs(line);
      const x = e.target.attrs.x + lineInfo.fromExcursionX;
      const y = e.target.attrs.y + lineInfo.fromExcursionY;

      if (lineInfo.type === "rightAngleLine") {
        const points = getUsePoint(line.attrs.points);
        const pointsRes = setRightAngleLineBeginOrEnd(points, 0, { x, y });
        line.setAttrs({ points: getUsePointUn(pointsRes) });
      } else {
        line.attrs.points[0] = x;
        line.attrs.points[1] = y;
        line.setAttrs({ points: line.attrs.points });
      }
    });
    lineInfo.inLineIds?.forEach((lineId: string) => {
      const line = ie.stage.findOne("#" + lineId);
      const { lineInfo } = getCustomAttrs(line);
      const x = e.target.attrs.x + lineInfo.toExcursionX;
      const y = e.target.attrs.y + lineInfo.toExcursionY;

      if (lineInfo.type === "rightAngleLine") {
        const points = getUsePoint(line.attrs.points);
        const pointsRes = setRightAngleLineBeginOrEnd(
          points,
          points!.length - 1,
          { x, y }
        );
        line.setAttrs({ points: getUsePointUn(pointsRes) });
      } else {
        line.attrs.points[line.attrs.points.length - 2] = x;
        line.attrs.points[line.attrs.points.length - 1] = y;
        line.setAttrs({ points: line.attrs.points });
      }
    });
  }
};
