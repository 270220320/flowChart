import Konva from "konva";
import layer from "../layer";
import INLEDITOR from "../..";
import { getUsePointUn, getUsePoint, connectNewRect } from "./line";
import { setRightAngleLineBeginOrEnd } from "./rightAngleLine";
import { getCustomAttrs } from "../customAttr";
import { getMouseOver } from "..";
import { computedXYByEvent } from "../computedXY";

export const bindPointEvent = (
  point: Konva.Circle,
  controlIndex: number,
  line: Konva.Arrow,
  ie: INLEDITOR
) => {
  point.on("dragmove", (e) => {
    const { x, y } = computedXYByEvent(ie.stage, e.evt);
    const points = getUsePoint(line.attrs.points);
    let resPoints;
    const { lineInfo } = getCustomAttrs(line);
    // 直角线
    if (lineInfo.type === "rightAngleLine") {
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
    const { x, y } = computedXYByEvent(ie.stage, e.evt);
    const points = getUsePoint(line.attrs.points);
    const newParent = getMouseOver({ x: e.evt.layerX, y: e.evt.layerY }, ie);
    const { lineInfo } = getCustomAttrs(line);
    if (newParent) {
      connectNewRect(
        line,
        controlIndex,
        newParent,
        {
          x,
          y,
        },
        ie
      );
    } else {
      if (controlIndex === 0) {
        const rectOut = ie.stage.findOne("#" + lineInfo.from);
        lineInfo.fromExcursionX = x - rectOut.attrs.x;
        lineInfo.fromExcursionY = y - rectOut.attrs.y;
      } else if (controlIndex === points.length - 1) {
        const rectIn = ie.stage.findOne("#" + lineInfo.to);
        lineInfo.toExcursionX = x - rectIn.attrs.x;
        lineInfo.toExcursionY = y - rectIn.attrs.y;
      }
    }
  });
};

export const addPoint = (ie: INLEDITOR, point: { x: number; y: number }) => {
  const utilLayer = layer(ie.stage, "util");
  const circle = new Konva.Circle({
    x: point.x,
    y: point.y,
    draggable: true,
    radius: 7,
    fill: "lightskyblue",
    stroke: "black",
    strokeWidth: 1,
  });
  utilLayer.add(circle);
  return circle;
};
