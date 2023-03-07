import Konva from "konva";
import layer from "../layer";
import INLEDITOR from "../..";
import { getUsePointUn, getUsePoint, connectNewRect } from "./line";
import { setRightAngleLineBeginOrEnd } from "./rightAngleLine";
import { getCustomAttrs, setCustomAttrs } from "../customAttr";
import { getMouseOver } from "..";
import computedXY, { computedXYByEvent } from "../computedXY";

export const bindPointEvent = (
  point: Konva.Circle,
  controlIndex: number,
  line: Konva.Arrow,
  stage: Konva.Stage
) => {
  setCustomAttrs(point, { type: "control" });
  point.on("dragmove", (e) => {
    const { x, y } = e.target.attrs;
    const points = getUsePoint(line.attrs.points);
    let resPoints;
    const lineInfo = getCustomAttrs(line).lineInfo!;
    // 直角线
    if (lineInfo.type.toLowerCase().indexOf("rightangle") !== -1) {
      resPoints = setRightAngleLineBeginOrEnd(points, controlIndex, {
        x,
        y,
      });
    } else {
      // 斜线
      points[controlIndex] = { x, y };
      resPoints = points;
    }
    const arr = getUsePointUn(resPoints);
    line.setAttrs({ points: arr });
  });
  point.on("dragend", (e: any) => {
    let position;
    const points = getUsePoint(line.attrs.points);
    const newParent = getMouseOver({ x: e.evt.layerX, y: e.evt.layerY }, stage);
    const lineInfo = getCustomAttrs(line).lineInfo!;
    if (controlIndex === 0) {
      position = {
        x: line.attrs.points[0],
        y: line.attrs.points[1],
      };
    } else if (controlIndex === points.length - 1) {
      position = {
        x: line.attrs.points[line.attrs.points.length - 2],
        y: line.attrs.points[line.attrs.points.length - 1],
      };
    }
    debugger;
    if (newParent) {
      connectNewRect(line, controlIndex, newParent, position, stage);
    } else {
      // 有BUG
      if (controlIndex === 0) {
        const rectOut = stage.findOne("#" + lineInfo.from);
        const xy = computedXY(
          stage,
          rectOut.absolutePosition().x,
          rectOut.absolutePosition().y
        );
        lineInfo.fromExcursionX = position.x - xy.x;
        lineInfo.fromExcursionY = position.y - xy.y;
      } else if (controlIndex === points.length - 1) {
        const rectIn = stage.findOne("#" + lineInfo.to);
        const xy = computedXY(
          stage,
          rectIn.absolutePosition().x,
          rectIn.absolutePosition().y
        );
        lineInfo.toExcursionX = position.x - xy.x;
        lineInfo.toExcursionY = position.y - xy.y;
      }
    }
  });
};

export const addPoint = (
  stage: Konva.Stage,
  point: { x: number; y: number }
) => {
  const utilLayer = layer(stage, "util");
  utilLayer.moveToTop();
  const circle = new Konva.Circle({
    x: point.x,
    y: point.y,
    draggable: true,
    radius: 5 / stage.scaleX(),
    fill: "white",
    stroke: "lightskyblue",
    strokeWidth: 0.5,
  });
  utilLayer.add(circle);
  return circle;
};
