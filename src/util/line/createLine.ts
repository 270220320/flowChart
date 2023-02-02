import Konva from "konva";
import INLEDITOR from "../..";
import { computedPoint, computedXYByEvent } from "src/util/computedXY";
import layer from "src/util/layer";
import { KonvaEventObject } from "konva/lib/Node";
import { getMouseOver } from "../";
import { getCustomAttrs, setCustomAttrs } from "../customAttr";
import { UUID } from "../uuid";
import { getLinePoints } from "./rightAngleLine";

export const finishLine = (
  ie: INLEDITOR,
  begin: Konva.Rect | Konva.Group,
  line: Konva.Arrow,
  point: { x: number; y: number },
  e: KonvaEventObject<MouseEvent>
) => {
  ie.stage.setAttrs({ draggable: true });
  begin.setAttrs({ draggable: true });
  // e.target.parent?.setAttrs({ draggable: true });
  let pos = ie.stage.getPointerPosition();
  const end = getMouseOver(pos!, ie);

  if (end) {
    const beginInfo = getCustomAttrs(begin).lineInfo;
    const endInfo = getCustomAttrs(end).lineInfo;

    const data = {
      from: begin.id(),
      fromExcursionX: line.attrs.points[0] - begin.attrs.x,
      fromExcursionY: line.attrs.points[1] - begin.attrs.y,
      to: end.id(),
      toExcursionX:
        line.attrs.points[line.attrs.points.length - 2] - end.attrs.x,
      toExcursionY:
        line.attrs.points[line.attrs.points.length - 1] - end.attrs.y,
    };
    setCustomAttrs(line, {
      lineInfo: data,
    });
    beginInfo.outLineIds.push(line.id());
    endInfo.inLineIds.push(line.id());
  } else {
    line.remove();
  }
};

const createLineMove = (
  line: Konva.Arrow,
  point: { x: number; y: number },
  ie: INLEDITOR
) => {
  if (ie.drawState === "Line") {
    line.attrs.points[2] = point.x;
    line.attrs.points[3] = point.y;
    line.points(line.attrs.points);
  } else {
    const res = getLinePoints(
      { x: line.attrs.points[0], y: line.attrs.points[1] },
      { x: point.x, y: point.y }
    );
    line.points(getUsePointUn(res));
  }
};

// 线
export const beginCreateLine = (
  ie: INLEDITOR,
  point: { x: number; y: number },
  e: KonvaEventObject<MouseEvent>
) => {
  ie.stage.setAttrs({ draggable: false });
  e.target.setAttrs({ draggable: false });
  // e.target.parent?.setAttrs({ draggable: false });

  const lay = layer(ie.stage, "line");
  lay.moveToTop();
  const line = createTemporaryLine(lay, point);
  ie.stage.on("mousemove", (e) => {
    const { x, y } = computedXYByEvent(ie.stage, e.evt);
    if (line) {
      createLineMove(line!, { x, y }, ie);
    }
  });
  return line;
};

export const createTemporaryLine = (
  layer: Konva.Layer,
  point: { x: number; y: number }
) => {
  var arrow = new Konva.Arrow({
    id: UUID(),
    points: [point.x, point.y, point.x, point.y],
    pointerLength: 20,
    pointerWidth: 20,
    fill: "black",
    stroke: "black",
    strokeWidth: 4,
  });

  layer.add(arrow);
  return arrow;
};

// 根据konva原始点转换使用点
export const getUsePoint: (
  p: Array<number>,
  i?: number
) => Array<{
  x: number;
  y: number;
}> = (p, i) => {
  const l = p.length;
  if (l % 2 !== 0) {
    console.warn("非原始点");
    return [];
  }
  const usePoint: Array<{
    x: number;
    y: number;
  }> = [];
  for (let i = 0; i < l / 2; i++) {
    const p1 = { x: p[i * 2], y: p[i * 2 + 1], i };
    usePoint.push(p1);
  }
  if (i === 0 || i) {
    return [usePoint[i]];
  }
  return usePoint;
};

// 根据konva原始点转换使用点 翻转
export const getUsePointUn: (
  p: Array<{
    x: number;
    y: number;
  }>
) => Array<number> = (p) => {
  const arr: Array<number> = [];
  for (let i of p) {
    arr.push(i.x, i.y);
  }
  return arr;
};
