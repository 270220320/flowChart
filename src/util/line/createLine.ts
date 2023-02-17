import Konva from "konva";
import INLEDITOR from "../..";
import { computedPoint, computedXYByEvent } from "src/util/computedXY";
import layer from "src/util/layer";
import { KonvaEventObject } from "konva/lib/Node";
import { getMouseOver } from "../";
import { getCustomAttrs, getLineInfo, setCustomAttrs } from "../customAttr";
import { UUID } from "../uuid";
import { getLinePoints } from "./rightAngleLine";
import { getUsePointUn } from "./line";
import { LineTheme } from "@/config/line";
import { lineState } from "../../config";

// 创建线完成
export const finishLine = (
  stage: Konva.Stage,
  begin: Konva.Rect | Konva.Group,
  line: Konva.Arrow,
  lineType
) => {
  if (begin.className !== "Image") {
    begin.setAttrs({ draggable: true });
  }

  begin.parent?.setAttrs({ draggable: true });
  let pos = stage.getPointerPosition();
  const end = getMouseOver(pos!, stage);

  if (end) {
    const beginInfo = getLineInfo(begin);
    const endInfo = getLineInfo(end);
    const data = {
      from: begin.id(),
      fromExcursionX: line.attrs.points[0] - begin.attrs.x,
      fromExcursionY: line.attrs.points[1] - begin.attrs.y,
      to: end.id(),
      toExcursionX:
        line.attrs.points[line.attrs.points.length - 2] - end.attrs.x,
      toExcursionY:
        line.attrs.points[line.attrs.points.length - 1] - end.attrs.y,
      type: lineType,
    };
    setCustomAttrs(line, {
      lineInfo: data,
    });
    beginInfo?.outLineIds?.push(line.id());
    endInfo?.inLineIds?.push(line.id());
  } else {
    line.remove();
  }
};

// 创建线过程中移动
const createLineMove = (
  line: Konva.Arrow,
  point: { x: number; y: number },
  opt
) => {
  if (opt.drawState.toLowerCase().indexOf("rightangle") !== -1) {
    const res = getLinePoints(
      { x: line.attrs.points[0], y: line.attrs.points[1] },
      { x: point.x, y: point.y }
    );
    line.points(getUsePointUn(res));
  } else {
    line.attrs.points[2] = point.x;
    line.attrs.points[3] = point.y;
    line.points(line.attrs.points);
  }
};

// 开始创建线
export const beginCreateLine = (
  stage: Konva.Stage,
  point: { x: number; y: number },
  e: KonvaEventObject<MouseEvent>,
  opt
) => {
  e.target.setAttrs({ draggable: false });
  e.target.parent?.setAttrs({ draggable: false });

  const lay = layer(stage, "line");
  lay.moveToTop();
  const line = createLine(lay, point, opt);
  stage.on("mousemove", (e) => {
    const { x, y } = computedXYByEvent(stage, e.evt);
    if (line) {
      createLineMove(line!, { x, y }, opt);
    }
  });
  return line;
};

// 画出预览线
export const createLine = (
  layer: Konva.Layer,
  point: { x: number; y: number },
  opt
) => {
  const dotted = opt.drawState.toLowerCase().indexOf("dotted") !== -1;
  const arrow = new Konva.Arrow({
    id: UUID(),
    points: [point.x, point.y, point.x, point.y],
    ...LineTheme[opt.theme],
    dash: dotted ? [10, 0, 10] : undefined,
    stroke: lineState[opt.theme][lineState.default],
    fill: lineState[opt.theme][lineState.default],
  });

  layer.add(arrow);
  return arrow;
};
