import Konva from "konva";
import layer from "../layer";
import INLEDITOR from "../..";
import { getUsePointUn, getUsePoint, connectNewRect } from "./line";
import { setRightAngleLineBeginOrEnd } from "./rightAngleLine";
import { getCustomAttrs, setCustomAttrs } from "../customAttr";
import { getMouseOver } from "..";
import computedXY, { computedXYByEvent } from "../computedXY";
import { enterEditLine, lineMouseUp } from "./editLine";
import pointConfig from "@/config/point";

export const bindPointEvent = (
  point: Konva.Circle,
  controlIndex: number,
  line: Konva.Arrow,
  stage: Konva.Stage
) => {
  setCustomAttrs(point, { type: "control" });
  let oldPoint: { x: number; y: number } = { x: 0, y: 0 };
  point.on("dragmove", (e) => {
    const { x, y } = e.target.attrs;
    const points = getUsePoint(line.attrs.points);
    // 处理线上字逻辑
    if (controlIndex === 0) {
      oldPoint = getUsePoint(line.attrs.points)[0];
    }
    let resPoints: { x: number; y: number }[] = [];
    const lineInfo = getCustomAttrs(line).lineInfo!;
    // 直角线
    if (lineInfo.type.toLowerCase().indexOf("rightangle") !== -1) {
      resPoints = setRightAngleLineBeginOrEnd(points, controlIndex, {
        x: x,
        y: y,
      });
    } else {
      // 斜线
      // shift
      if (e.evt.shiftKey) {
        // 开始点
        if (controlIndex === 0) {
          // x远
          if (Math.abs(x - points[1].x) - Math.abs(y - points[1].y) > 0) {
            points[controlIndex] = { x, y: points[1].y };
          } else {
            points[controlIndex] = { x: points[1].x, y };
          }
        } else {
          if (Math.abs(x - points[0].x) - Math.abs(y - points[0].y) > 0) {
            points[controlIndex] = { x, y: points[0].y };
          } else {
            points[controlIndex] = { x: points[0].x, y };
          }
        }
      } else {
        points[controlIndex] = { x, y };
      }

      resPoints = points;
    }

    const arr = getUsePointUn(resPoints);
    line.setAttrs({ points: arr });
    // 线上字跟随
    if (controlIndex === 0) {
      const distanceChange = {
        x: line.getAttr("points")[0] - oldPoint.x,
        y: line.getAttr("points")[1] - oldPoint.y,
      };
      const iu = getCustomAttrs(line.parent)?.thing?.iu;
      const group: Konva.Group = stage.find("#line" + iu)[0] as Konva.Group;
      group?.children.forEach((textGroup) => {
        if (textGroup.className !== "Arrow") {
          const location = textGroup?.getAbsolutePosition();
          textGroup?.setAbsolutePosition({
            x: location.x + distanceChange.x * stage.scaleX(),
            y: location.y + distanceChange.y * stage.scaleX(),
          });
        }
      });
    }
    stage.batchDraw();
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
    } else {
      position = {
        x: line.attrs.points[line.attrs.points.length - 2],
        y: line.attrs.points[line.attrs.points.length - 1],
      };
    }
    // 合并重合的
    lineMouseUp(e, stage);
    if (newParent && newParent.name() === "thingImage") {
      connectNewRect(line, controlIndex, newParent, position, stage);
    } else {
      if (controlIndex === 0) {
        const rectOut = stage.findOne("#" + lineInfo.from);
        const xy = computedXY(
          stage,
          rectOut.absolutePosition().x,
          rectOut.absolutePosition().y
        );
        lineInfo.fromExcursionX = position.x - xy.x;
        lineInfo.fromExcursionY = position.y - xy.y;
      } else {
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
    // stage.draw();
    enterEditLine(line, stage);
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
    radius: pointConfig.radius / stage.scaleX(),
    fill: "white",
    stroke: "lightskyblue",
    strokeWidth: 0.5,
  });
  utilLayer.add(circle);
  return circle;
};
