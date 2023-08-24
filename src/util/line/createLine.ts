import Konva from "konva";
import INLEDITOR from "../..";
import computedXY, { computedXYByEvent } from "src/util/computedXY";
import layer from "src/util/layer";
import { KonvaEventObject } from "konva/lib/Node";
import { getMouseOver } from "../";
import { getLineInfo, setCustomAttrs } from "../customAttr";
import { UUID } from "../uuid";
import { getLinePoints, mergeRightAngleLinePoint } from "./rightAngleLine";
import { getUsePoint, getUsePointUn } from "./line";
import { LineTheme } from "@/config/line";
import { lineState } from "../../config";
import { isComponentChildren } from "@/component";
import { judge } from "../anchor";
import { createThingGroup } from "@/element";
import { addLineBorder } from "./border";

// 创建线完成
export const finishLine = (
  ie: INLEDITOR,
  begin: Konva.Node,
  line: Konva.Arrow | Konva.Line,
  lineType
) => {
  const stage = ie.getStage();
  // 设备
  debugger;
  if (begin.className === "Image" && begin.parent?.nodeType === "Group") {
    begin.parent?.setAttrs({ draggable: true });
    //组件
  }
  if (isComponentChildren(begin)) {
    begin.parent.parent.setAttrs({ draggable: true });
    begin = begin.parent;
  } else {
    begin.setAttrs({ draggable: true });
  }

  let pos = stage.getPointerPosition();
  let end = getMouseOver(pos!, stage);
  if (end?.attrs.componentName === "Technique") {
    if (!judge(stage, pos, end)) {
      end = undefined;
    }
  }
  if (begin === end) {
    end = undefined;
  }
  if (end && end.name() === "thingImage") {
    end.setAttrs({ strokeWidth: 0 });
    const beginInfo = getLineInfo(begin);
    const endInfo = getLineInfo(end);
    const xya = computedXY(
      stage,
      begin.absolutePosition().x,
      begin.absolutePosition().y
    );
    const xyb = computedXY(
      stage,
      end.absolutePosition().x,
      end.absolutePosition().y
    );
    const data = {
      from: begin.id(),
      fromExcursionX: line.attrs.points[0] - xya.x,
      fromExcursionY: line.attrs.points[1] - xya.y,
      to: end.id(),
      toExcursionX: line.attrs.points[line.attrs.points.length - 2] - xyb.x,
      toExcursionY: line.attrs.points[line.attrs.points.length - 1] - xyb.y,
      type: lineType,
      state: lineState.default,
    };
    setCustomAttrs(line, {
      lineInfo: data,
    });
    const group = createThingGroup({});
    group.setAttrs({ draggable: false });
    line.getLayer().add(group);
    group.add(line);
    if (lineType.toLowerCase().indexOf("dotted") === -1) {
      addLineBorder(line, ie);
    }

    beginInfo?.outLineIds?.push(line.id());
    endInfo?.inLineIds?.push(line.id());
    if (lineType.indexOf("rightAngle") >= 0) {
      const points = getUsePoint(line.attrs.points);
      const resPoints = mergeRightAngleLinePoint(points);
      line.setAttrs({ points: getUsePointUn(resPoints) });
    }
    const cb = ie.opt.onCreateLineCb;
    cb?.(line.id());
  } else {
    line.remove();
  }
};

// 创建线过程中移动
const createLineMove = (
  line: Konva.Arrow | Konva.Line,
  point: { x: number; y: number },
  opt,
  e?
) => {
  if (opt.drawState.toLowerCase().indexOf("rightangle") !== -1) {
    const res = getLinePoints(
      { x: line.attrs.points[0], y: line.attrs.points[1] },
      { x: point.x, y: point.y }
    );
    line.points(getUsePointUn(res));
  } else {
    // shift
    if (e.evt.shiftKey) {
      if (
        Math.abs(point.x - line.attrs.points[0]) -
          Math.abs(point.y - line.attrs.points[0]) >
        0
      ) {
        line.attrs.points[2] = point.x;
        line.attrs.points[3] = line.attrs.points[1];
      } else {
        line.attrs.points[2] = line.attrs.points[0];
        line.attrs.points[3] = point.y;
      }
    } else {
      line.attrs.points[2] = point.x;
      line.attrs.points[3] = point.y;
    }

    line.setAttrs({ points: line.attrs.points });
  }
};

// 开始创建线
export const beginCreateLine = (
  ie: INLEDITOR,
  point: { x: number; y: number },
  e: KonvaEventObject<MouseEvent>,
  opt
) => {
  const stage = ie.getStage();
  // 设备
  if (e.target.className === "Image" && e.target.parent?.nodeType === "Group") {
    e.target.parent?.setAttrs({ draggable: false });
  }
  //组件
  if (isComponentChildren(e.target)) {
    e.target.parent.parent.setAttrs({ draggable: false });
  }
  if (e.target.name() === "selfShape" || e.target.className === "Text") {
    return;
  }
  e.target.setAttrs({ draggable: false });

  const lay = layer(stage, "line");
  lay.moveToTop();
  const line = createLine(ie, point, opt);
  let end;
  stage.on("mousemove", (e) => {
    const { x, y } = computedXYByEvent(stage, e.evt);
    if (line) {
      createLineMove(line!, { x, y }, opt, e);
      let pos = stage.getPointerPosition();
      if (end) {
        end.setAttrs({ strokeWidth: 0 });
      }
      end = getMouseOver(pos!, stage);
      if (end && end.name() === "thingImage") {
        end.setAttrs({ stroke: "red", strokeWidth: 1 });
      }
    }
  });
  return line;
};

// 画出预览线
export const createLine = (
  ie: INLEDITOR,
  point: { x: number; y: number },
  opt
) => {
  const stage = ie.getStage();
  const lay = layer(stage, "line");
  // 管道是line
  const isLine = opt.drawState.toLowerCase().indexOf("dotted") === -1;

  const arrow = new Konva[isLine ? "Line" : "Arrow"]({
    id: UUID(),
    points: [point.x, point.y, point.x, point.y],
    ...LineTheme[opt.theme],
    pointerFill: lineState[opt.theme][lineState.default],
    stroke: lineState[opt.theme][lineState.default],
    fill: lineState[opt.theme][lineState.default],
    name: "line",
  });
  if (isLine) {
    arrow.setAttrs({
      dash: ie.drawInfo?.dotted || [8, 8, 8, 8],
      lineJoin: "round",
    });
  }

  lay.add(arrow);
  return arrow;
};
