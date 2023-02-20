import Konva from "konva";
import layer from "../layer";
import INLEDITOR from "../..";
import { getUsePointUn, getUsePoint, connectNewRect } from "./line";
import { setRightAngleLineBeginOrEnd } from "./rightAngleLine";
import { getCustomAttrs, setCustomAttrs } from "../customAttr";
import { getMouseOver } from "..";
import { computedXYByEvent } from "../computedXY";

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
    const { x, y } = e.target.attrs;
    const points = getUsePoint(line.attrs.points);
    const newParent = getMouseOver({ x: e.evt.layerX, y: e.evt.layerY }, stage);
    const lineInfo = getCustomAttrs(line).lineInfo!;
    if (newParent) {
      connectNewRect(
        line,
        controlIndex,
        newParent,
        {
          x,
          y,
        },
        stage
      );
    } else {
      if (controlIndex === 0) {
        const rectOut = stage.findOne("#" + lineInfo.from);
        lineInfo.fromExcursionX = x - rectOut.attrs.x;
        lineInfo.fromExcursionY = y - rectOut.attrs.y;
      } else if (controlIndex === points.length - 1) {
        const rectIn = stage.findOne("#" + lineInfo.to);
        lineInfo.toExcursionX = x - rectIn.attrs.x;
        lineInfo.toExcursionY = y - rectIn.attrs.y;
      }
    }
  });
};

export const addPoint = (
  stage: Konva.Stage,
  point: { x: number; y: number }
) => {
  const utilLayer = layer(stage, "util");
  const circle = new Konva.Circle({
    x: point.x,
    y: point.y,
    draggable: true,
    radius: 7,
    fill: "lightskyblue",
    stroke: "black",
    strokeWidth: 0.5,
  });
  utilLayer.add(circle);
  return circle;
};
