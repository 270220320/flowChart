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
  const rect = createSelectionBox(ie.stage) as Konva.Rect;
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

// 线
const onLine = () => {};

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
  ie.stage.on("mousedown", (e) => {
    if (e.target !== ie.stage) return;
    const { y, x } = computedXYByEvent(ie.stage, e.evt);
    switch (ie.drawState) {
      case "line":
        onLine();
      default:
        onSelection(ie, { y, x }, (rc) => {
          rect = rc;
        });
    }
  });

  ie.stage.on("mouseup", (e) => {
    offSelection(ie);
    switch (ie.drawState) {
      case "rect":
        onRect(ie, rect);
      case "line":
        onLine();
    }
    ie.drawState = "selection";
    rect = null;
  });
};
