import Konva from "konva";
import _ from "lodash";
import { computedPoint, computedXYByEvent } from "@/util/computedXY";
import layer from "@/util/layer";
import INLEDITOR from "..";
import {
  createSelectionBox,
  defaultRect,
  removeSelectionBox,
} from "../element/rect";
import { beginCreateLine, finishLine } from "../util/line/createLine";
import {
  checkKeepEdit,
  editMouseDown,
  exitEditLine,
  lineMouseUp,
} from "@/util/line/editLine";
import { Theme } from "@/config/theme";

const offSelection = (stage: Konva.Stage) => {
  // 删除 layer
  removeSelectionBox(stage);
  // 移除mosemove 监听
  stage.off("mousemove");
};

// 默认框选
const onSelection = (
  stage: Konva.Stage,
  startPoint: { x: number; y: number },
  themeType: Theme,
  cb: (rect: Konva.Rect) => void
) => {
  const rect = createSelectionBox(stage, themeType) as Konva.Rect;
  rect.setAttrs(startPoint);
  let flag: number;
  stage.on("mousemove", (e) => {
    if (flag) clearTimeout(flag);
    flag = setTimeout(() => {
      // 默认框选
      const { y, x } = computedXYByEvent(stage, e.evt);
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
  const shapeLayer = layer(ie.getStage(), "thing");
  const createDefaultRect = defaultRect({ width, height, x, y });
  shapeLayer.add(createDefaultRect);
};

export default (ie: INLEDITOR, cb?: () => void) => {
  let rect: Konva.Rect | null;
  let line: Konva.Arrow | undefined;
  let begin: Konva.Rect | Konva.Group | null;
  const stage = ie.getStage();
  const drawState = ie.getDrawState();
  stage.on("mousedown", (e) => {
    const { x, y } = computedXYByEvent(stage, e.evt);
    if (drawState === "default") return;
    stage.setAttrs({
      draggable: false,
    });
    switch (drawState) {
      case "rightAngleLine":
      case "Line":
        // debugger;
        if (e.target.className === "Rect" || e.target.className === "Image") {
          begin = e.target as Konva.Rect;
          line = beginCreateLine(ie, { x, y }, e);
        }
        break;
      case "editLine":
        editMouseDown(e, ie);
        break;
      default:
        onSelection(ie.getStage(), { y, x }, ie.getTheme(), (rc) => {
          rect = rc;
        });
    }
  });

  stage.on("mouseup", (e) => {
    const { x, y } = computedXYByEvent(stage, e.evt);
    cb ? cb() : null;
    offSelection(ie.getStage());
    switch (drawState) {
      case "Rect":
        onRect(ie, rect);
        break;
      case "editLine":
        if (checkKeepEdit(e, ie)) {
          lineMouseUp(e, ie);
          return;
        } else {
          exitEditLine(ie);
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
    ie.setDrawState("default");
    stage.setAttrs({
      draggable: true,
    });
    rect = null;
  });
};
