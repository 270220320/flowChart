import Konva from "konva";
import INLEDITOR from "@/index";
import { KonvaEventObject } from "konva/lib/Node";
import { getCustomAttrs, getLineInfo } from "../customAttr";
import { getUsePoint, getUsePointUn } from "../line/line";
import { setRightAngleLineBeginOrEnd } from "../line/rightAngleLine";

export const dealRelation = (e: KonvaEventObject<any>, stage: Konva.Stage) => {
  console.log(e.target);
  if (e.target.className === "Rect" || e.target.className === "Image") {
    const lineInfo = getLineInfo(e.target)!;
    lineInfo.outLineIds?.forEach((lineId: string) => {
      const line = stage.findOne("#" + lineId);
      const { lineInfo } = getCustomAttrs(line) as any;
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
      const line = stage.findOne("#" + lineId);
      const { lineInfo } = getCustomAttrs(line) as any;
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
