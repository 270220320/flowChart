import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import _ from "lodash";
import { computedPoint, computedXYByEvent } from "src/util/computedXY";
import INLEDITOR from "..";
import { selectionBox, removeSelectionBox } from "../config/rect.config";

const renderSelection = (
  start: { x: number; y: number },
  ie: INLEDITOR,
  e: KonvaEventObject<MouseEvent>,
  rect: Konva.Rect
) => {
  const { y, x } = computedXYByEvent(ie.stage, e.evt);
  const rectAttrs = computedPoint(start, { x, y });
  rect.setAttrs(rectAttrs);
  // 根据绘制状态做其他事情

  // 绘制图形
  // 框选元素
};

const offSelection = (ie: INLEDITOR) => {
  // 删除 layer
  removeSelectionBox(ie.stage);
  // 移除mosemove 监听
  ie.stage.off("mousemove");
};

export default (ie: INLEDITOR) => {
  let flag: number | undefined;
  let rect: Konva.Rect;
  ie.stage.on("mousedown", (e) => {
    rect = selectionBox(ie.stage) as Konva.Rect;
    const { y, x } = computedXYByEvent(ie.stage, e.evt);
    rect.setAttrs({ x, y });
    ie.stage.on("mousemove", (e) => {
      if (flag) clearTimeout(flag);
      flag = setTimeout(() => {
        // 默认框选
        renderSelection({ y, x }, ie, e, rect);
      }, 2);
    });
  });

  ie.stage.on("mouseup", (e) => {
    offSelection(ie);
    const attrs = _.cloneDeep(rect.attrs);
    console.log(rect);
  });
};
