import INLEDITOR from "../..";
import { closeSubLine, initSubLine } from "./subline";
import { dealRelation } from "../../util/element/relation";
import { clearTransFormer, getTran } from "../selectItem";
import { getCustomAttrs } from "@/main";

export default (ie: INLEDITOR, cb?: () => void) => {
  const stage = ie.getStage();
  // 按下移动
  stage.on("dragmove", (e: any) => {
    if (e.target.name() === "field") {
      return;
    }
    // 启动辅助线
    if (getCustomAttrs(e.target).type !== "control") {
      initSubLine.bind(ie)(stage, e);
    }
    // 块关联线随动
    let target;

    if (
      e.target.nodeType === "Shape" ||
      e.target.nodeType === "Image" ||
      e.target.name() === "thingImage"
    ) {
      target = e.target;
    } else if (e.target.name() === "thingGroup") {
      target = e.target.children.find((ele) => ele.name() === "thingImage");
    }
    if (target) {
      dealRelation(target, ie.getStage());
    }

    if (e.target !== stage && e.target.getClassName() !== "Transformer") {
      const { nodes } = getTran(stage);
      if (nodes.length === 1 && nodes[0] !== e.target) {
        clearTransFormer(stage);
      }
    }

    cb ? cb() : null;
  });
  // 结束拖动
  stage.on("dragend", () => {
    // ie.historyArr[0] = stage.toJSON();
    stage.batchDraw();
    if (ie.historyArr.length >= 5) {
      ie.historyArr.shift();
    }
    ie.historyArr.push(stage.toJSON());
    // 关闭辅助线
    closeSubLine.bind(ie)();
  });
};
