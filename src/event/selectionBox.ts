import Konva from "konva";
import _ from "lodash";
import { computedPoint, computedXYByEvent } from "src/util/computedXY";
import layer from "src/util/layer";
import INLEDITOR from "..";
import {
  createSelectionBox,
  defaultRect,
  removeSelectionBox,
} from "../config/rect.config";
import { beginCreateLine, finishLine } from "../util/line/createLine";

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
  const shapeLayer = layer(ie, "shape");
  const createDefaultRect = defaultRect({ width, height, x, y });
  shapeLayer.add(createDefaultRect);
};

export default (ie: INLEDITOR) => {
  let rect: Konva.Rect | null;
  let line: Konva.Arrow | undefined;
  let begin: Konva.Rect | Konva.Group | null;
  ie.stage.on("mousedown", (e) => {
    const { y, x } = computedXYByEvent(ie.stage, e.evt);
    switch (ie.drawState) {
      case "line":
        if (e.target.className === "Rect") {
          begin = e.target as Konva.Rect;
          line = beginCreateLine(ie, { x, y }, e);
        }

        break;
      default:
        onSelection(ie, { y, x }, (rc) => {
          rect = rc;
        });
    }
  });

  ie.stage.on("mouseup", (e) => {
    const { x, y } = computedXYByEvent(ie.stage, e.evt);
    offSelection(ie);
    switch (ie.drawState) {
      case "rect":
        onRect(ie, rect);
        break;
      case "line":
        if (line) {
          finishLine(ie, begin, line!, { x, y }, e);
          line = undefined;
        }
    }
    ie.drawState = "selection";
    rect = null;
  });
};
