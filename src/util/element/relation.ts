import Konva from "konva";
import INLEDITOR from "@/index";
import { KonvaEventObject } from "konva/lib/Node";
import { getCustomAttrs, getLineInfo } from "../customAttr";
import { getUsePoint, getUsePointUn } from "../line/line";
import { setRightAngleLineBeginOrEnd } from "../line/rightAngleLine";
import computedXY from "../computedXY";

export const dealRelation = (e: any, stage: Konva.Stage) => {
  let target;
  if (e.target.nodeType === "Shape" || e.target.nodeType === "Image") {
    target = e.target;
  } else if (e.target.nodeType === "Group") {
    target = e.target.children.find((ele) => ele.name() === "thingImage");
  }
  if (target) {
    const lineInfo = getLineInfo(target)!;
    const point = computedXY(
      stage,
      target.absolutePosition().x,
      target.absolutePosition().y
    );
    lineInfo.outLineIds?.forEach((lineId: string) => {
      const line = stage.findOne("#" + lineId);
      const { lineInfo } = getCustomAttrs(line) as any;

      const x = point.x + lineInfo.fromExcursionX;
      const y = point.y + lineInfo.fromExcursionY;
      if (lineInfo.type.toLowerCase().indexOf("rightangle") !== -1) {
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
      const x = point.x + lineInfo.toExcursionX;
      const y = point.y + lineInfo.toExcursionY;
      if (lineInfo.type.toLowerCase().indexOf("rightangle") !== -1) {
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
