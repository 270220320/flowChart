import Konva from "konva";
import INLEDITOR from "../..";
import { getUsePointUn, getUsePoint } from "./line";
import { getInsertIndex, movePartOfLine } from "./lineLogic";

let editLine: Konva.Arrow;
let clickIndex: number;

// 进入线编辑状态
export const enterEditLine = (line: Konva.Arrow, ie: INLEDITOR) => {
  editLine = line;
};

// 线编辑状态按下鼠标
export const lineMouseDown = (e: any, ie: INLEDITOR) => {
  if (e.target === editLine) {
    const arr = getUsePoint(editLine.attrs.points);
    clickIndex = getInsertIndex(arr, {
      x: e.evt.layerX,
      y: e.evt.layerY,
    });
    ie.stage.on("mousemove", (e: any) => {
      const arr = getUsePoint(editLine.attrs.points);
      const points = movePartOfLine(arr, clickIndex, {
        x: e.evt.layerX,
        y: e.evt.layerY,
      });
      editLine.setAttrs({ points: getUsePointUn(points) });
    });
  }
};
// 线编辑状态抬起鼠标
export const lineMouseUp = (
  e: Konva.KonvaEventObject<MouseEvent>,
  ie: INLEDITOR
) => {
  ie.stage.off("mousemove");
};
// 检查是否继续编辑
export const checkKeepEdit = (
  e: Konva.KonvaEventObject<MouseEvent>,
  ie: INLEDITOR
) => {
  if (e.target === editLine) {
    return true;
  } else {
    return false;
  }
};
