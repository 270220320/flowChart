import Konva from "konva";
import _ from "lodash";
import { computedPoint, computedXYByEvent } from "../util/computedXY";
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
} from "../util/line/editLine";
import { Theme } from "../config/theme";
import { createEditableText } from "../element/text";
import { getTran, toSelect } from "./selectItem";
import { getInclude } from "@/util/element/getInclude";
import { createImage } from "@/element";
import customAddImage from "./ondrop/customAddImage";
import { showAnchor } from "@/util/anchor";

const offSelection = (stage: Konva.Stage) => {
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
  let flag: any;
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
const onRect = (
  stage: Konva.Stage,
  rect: Konva.Rect | null,
  themeType: Theme
) => {
  if (!rect) return;
  const { width, height, x, y } = _.cloneDeep(rect.attrs);
  const shapeLayer = layer(stage, "thing");
  const createDefaultRect = defaultRect({ width, height, x, y }, themeType);
  createDefaultRect.name("selfShape");
  shapeLayer.add(createDefaultRect);
};

// custom text
const customText = (
  stage: Konva.Stage,
  startPoint: { x: number; y: number },
  themeType: Theme
) => {
  const text = createEditableText(stage, startPoint, themeType);
  text.on("transform", (e) => {
    const { width } = getTran(stage).position;
    text.setAttrs({ width: text.width() * text.scaleX(), scaleX: 1 });
  });
};

export default (ie: INLEDITOR, cb?: () => void) => {
  let rect: Konva.Rect | null;
  let line: Konva.Arrow | undefined;
  let begin: Konva.Rect | Konva.Group | null;
  const stage = ie.getStage();
  stage.on("mousedown", (e) => {
    const stage = ie.getStage();
    const drawState = ie.getDrawState();
    const { x, y } = computedXYByEvent(stage, e.evt);
    if (drawState === "dragStage") return;
    stage.setAttrs({
      draggable: false,
    });

    switch (drawState) {
      case "img":
        customAddImage(stage, e.evt, ie.drawInfo);
        break;
      case "rightAngleLine":
      case "rightAngleDottedLine":
      case "dottedLine":
      case "Line":
        if (
          e.target.className === "Rect" ||
          e.target.className === "Image" ||
          e.target.className === "Circle"
        ) {
          begin = e.target as Konva.Rect;
          line = beginCreateLine(stage, { x, y }, e, {
            theme: ie.getTheme(),
            drawState: ie.getDrawState(),
          });
        }
        break;
      case "Text":
        customText(stage, { x, y }, ie.getTheme());
        break;
      case "editLine":
        editMouseDown(e, stage);
        break;
      default:
        if (e.target.getClassName() === "Stage") {
          onSelection(ie.getStage(), { y, x }, ie.getTheme(), (rc) => {
            rect = rc;
          });
        } else {
          rect = null;
        }
    }
  });

  stage.on("mouseup", (e) => {
    const stage = ie.getStage();
    const drawState = ie.getDrawState();
    cb ? cb() : null;
    switch (drawState) {
      case "Rect":
        onRect(stage, rect, ie.getTheme());
        break;
      case "editLine":
        if (checkKeepEdit(e)) {
          lineMouseUp(e, stage);
          stage.off("mousemove");
          return;
        } else {
          exitEditLine(stage);
        }
        break;

      case "rightAngleLine":
      case "rightAngleDottedLine":
      case "dottedLine":
      case "Line":
        if (line) {
          finishLine(stage, begin!, line!, ie.getDrawState());
          line = undefined;
        }
        showAnchor(stage, "hide");
        break;
      default:
        // rect未置空
        if (rect) {
          try {
            // 框选
            const nodes = getInclude(ie, rect);
            toSelect(stage, nodes, ie.selectCb);
          } catch (res) {
            console.log("选中暂不节流");
          }
        }
    }
    removeSelectionBox(stage);
    rect = null;
    offSelection(ie.getStage());
    ie.setDrawState("default");
  });
};
