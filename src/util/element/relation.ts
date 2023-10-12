import Konva from "konva";
import { getCustomAttrs, getLineInfo } from "../customAttr";
import { getUsePoint, getUsePointUn } from "../line/line";
import { setRightAngleLineBeginOrEnd } from "../line/rightAngleLine";
import computedXY from "../computedXY";

export const dealRelation = (
  target,
  stage: Konva.Stage,
  nodes?: Konva.Node[]
) => {
  const lineInfo = getLineInfo(target)!;
  const point = computedXY(
    stage,
    target.absolutePosition().x,
    target.absolutePosition().y
  );
  lineInfo.outLineIds?.forEach((lineId: string) => {
    const line = stage.findOne("#" + lineId);
    // 线随动前的点
    const oldPoint = {
      x: line.attrs.points[0],
      y: line.attrs.points[1],
    };
    const { lineInfo } = getCustomAttrs(line) as any;

    const x = point.x + lineInfo.fromExcursionX;
    const y = point.y + lineInfo.fromExcursionY;
    const distanceChange = {
      x: x - oldPoint.x,
      y: y - oldPoint.y,
    };

    const points = getUsePoint(line.attrs.points);
    if (lineInfo.type.toLowerCase().indexOf("rightangle") !== -1) {
      if (nodes) {
        const to = nodes.find((ele: Konva.Node) => ele.id() === lineInfo.to);
        if (to) {
          points.forEach((ele, index) => {
            ele.x += distanceChange.x;
            ele.y += distanceChange.y;
          });
        }
      }
      const pointsRes = setRightAngleLineBeginOrEnd(points, 0, { x, y });
      line.setAttrs({ points: getUsePointUn(pointsRes) });
    } else {
      points[0] = { x, y };
      line.setAttrs({ points: getUsePointUn(points) });
    }
    stage.draw();
    // 线的字随动

    const iu = getCustomAttrs(line.parent)?.thing?.iu;
    const group: Konva.Group = stage.find("#line" + iu)[0] as Konva.Group;
    group?.children.forEach((textGroup) => {
      if (
        textGroup.className !== "Arrow" &&
        textGroup.className !== "Line" &&
        textGroup.name() !== "line"
      ) {
        const location = textGroup?.getAbsolutePosition();
        textGroup?.setAbsolutePosition({
          x: location.x + distanceChange.x * stage.scaleX(),
          y: location.y + distanceChange.y * stage.scaleX(),
        });
      }
    });
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
};
