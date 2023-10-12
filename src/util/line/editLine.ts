import Konva from "konva";
import INLEDITOR from "../..";
import { getUsePointUn, getUsePoint } from "./line";
import { getInsertIndex, movePartOfLine } from "./lineLogic";
import { addPoint, bindPointEvent } from "./point";
import { turnDrag } from "./rect";
import { computedXYByEvent } from "../computedXY";
import { mergeRightAngleLinePoint } from "./rightAngleLine";

let editLine: Konva.Arrow;
let controls: Konva.Circle[] = [];
let clickIndex: number;

// 退出线编辑状态
export const exitEditLine = (stage: Konva.Stage) => {
  turnDrag(stage, true);
  stage.find(".controlPoint").forEach((point) => {
    point.remove();
  });
  editLine?.off("mouseenter");
  editLine?.off("mouseleave");
  controls = [];
  editLine = undefined;
};
// 进入线编辑状态
export const enterEditLine = (line: Konva.Arrow, ie: INLEDITOR) => {
  const stage = ie.getStage();
  if (line === editLine) {
    // return;
    exitEditLine(stage);
  }
  // 关闭拖动
  turnDrag(stage, false);
  editLine = line;
  editLine.on("mouseenter", function () {
    stage.container().style.cursor = "move";
  });

  editLine.on("mouseleave", function () {
    stage.container().style.cursor = "default";
  });
  const length = line.attrs.points.length;
  const pBegin = addPoint(stage, {
    x: line.attrs.points[0],
    y: line.attrs.points[1],
  });
  const pEnd = addPoint(stage, {
    x: line.attrs.points[length - 2],
    y: line.attrs.points[length - 1],
  });
  controls.push(pBegin, pEnd);
  const points = getUsePoint(editLine.attrs.points);
  bindPointEvent(pBegin, 0, editLine, ie);
  bindPointEvent(pEnd, points.length - 1, editLine, ie);
};
// 线编辑点击线
const lineMouseDown = (e: any, stage: Konva.Stage) => {
  const arr = getUsePoint(editLine.attrs.points);
  const { x, y } = computedXYByEvent(stage, e.evt);
  clickIndex = getInsertIndex(arr, {
    x,
    y,
  });
  stage.on("mousemove", (e: any) => {
    const { x, y } = computedXYByEvent(stage, e.evt);
    const arr = getUsePoint(editLine.attrs.points);
    const points = movePartOfLine(arr, clickIndex, {
      x,
      y,
    });
    if (clickIndex === 1) {
      clickIndex = 2;
    }
    editLine.setAttrs({ points: getUsePointUn(points) });
  });
};
const getPointIndex = (arr: Konva.Circle[], circle: Konva.Circle) => {
  let num = -1;
  controls.forEach((ele: any, index: number) => {
    if (ele === circle) {
      num = index;
    }
  });
  return num;
};
// 线编辑状态按下鼠标
export const editMouseDown = (e: any, stage: Konva.Stage) => {
  if (e.target === editLine) {
    lineMouseDown(e, stage);
  } else if (e.target.className === "Line" || e.target.className === "Arrow") {
    const edit = e.target.parent.children.find(
      (node: Konva.Node) => node.id() === editLine.id()
    );
    if (edit) {
      lineMouseDown(e, stage);
    }
  }
};
// 线编辑状态抬起鼠标
export const lineMouseUp = (
  e: Konva.KonvaEventObject<MouseEvent>,
  stage: Konva.Stage
) => {
  const points = getUsePoint(editLine.attrs.points);
  const resPoints = mergeRightAngleLinePoint(points);
  editLine.setAttrs({ points: getUsePointUn(resPoints) });
  stage.off("mousemove");
};
// 检查是否继续编辑
export const checkKeepEdit = (e: any) => {
  if (e.target === editLine || getPointIndex(controls, e.target) != -1) {
    return true;
  } else {
    return false;
  }
};
