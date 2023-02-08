import Konva from "konva";
import _ from "lodash";
import { computedPoint, computedXYByEvent } from "src/util/computedXY";
import layer from "src/util/layer";
import INLEDITOR from "..";
import {
  createSelectionBox,
  defaultRect,
  removeSelectionBox,
} from "../element/rect";
import { beginCreateLine, finishLine } from "../util/line/createLine";
import {
  checkKeepEdit,
  lineMouseDown,
  lineMouseUp,
} from "src/util/line/editLine";

const offSelection = (ie: INLEDITOR) => {
  // 删除 layer
  removeSelectionBox(ie.stage);
  // 移除mosemove 监听
  ie.stage.off("mousemove");
};

// 默认框选
const onSelection = (
  ie: INLEDITOR,
  startPoint: { x: number; y: number },
  cb: (rect: Konva.Rect) => void
) => {
  const rect = createSelectionBox(ie.stage, ie.theme) as Konva.Rect;
  rect.setAttrs(startPoint);
  let flag: number;
  ie.stage.on("mousemove", (e) => {
    if (flag) clearTimeout(flag);
    flag = setTimeout(() => {
      // 默认框选
      const { y, x } = computedXYByEvent(ie.stage, e.evt);
      const rectAttrs = computedPoint(startPoint, { x, y });
      rect.setAttrs(rectAttrs);
      cb(rect);
    }, 2);
  });
};

// 矩形
const onRect = (ie: INLEDITOR, rect: Konva.Rect | null) => {
  if (!rect) return;
  const { width, height, x, y } = _.cloneDeep(rect.attrs);
  const shapeLayer = layer(ie.stage, "thing");
  const createDefaultRect = defaultRect({ width, height, x, y });
  shapeLayer.add(createDefaultRect);
};

export default (ie: INLEDITOR, cb?: () => void) => {
  let rect: Konva.Rect | null;
  let line: Konva.Arrow | undefined;
  let begin: Konva.Rect | Konva.Group | null;
  ie.stage.on("mousedown", (e) => {
    const { y, x } = computedXYByEvent(ie.stage, e.evt);
    if (ie.drawState === "default") return;
    ie.stage.setAttrs({
      draggable: false,
    });
    switch (ie.drawState) {
      case "rightAngleLine":
      case "Line":
        if (e.target.className === "Rect") {
          begin = e.target as Konva.Rect;
          line = beginCreateLine(ie, { x, y }, e);
        }
        break;
      case "editLine":
        lineMouseDown(e, ie);
        break;
    }
  });

  ie.stage.on("mouseup", (e) => {
    const { x, y } = computedXYByEvent(ie.stage, e.evt);
    cb ? cb() : null;
    offSelection(ie);
    switch (ie.drawState) {
      case "Rect":
        onRect(ie, rect);
        break;
      case "editLine":
        if (checkKeepEdit(e, ie)) {
          lineMouseUp(e, ie);
          return;
        }
        break;
      case "rightAngleLine":
      case "Line":
        if (line) {
          finishLine(ie, begin!, line!, { x, y }, e);
          line = undefined;
        }
        break;
    }
    ie.drawState = "default";
    ie.stage.setAttrs({
      draggable: true,
    });
    rect = null;
  });
};
