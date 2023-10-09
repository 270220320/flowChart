import INLEDITOR from "../..";
import { closeSubLine, initSubLine } from "./subline";
import { dealRelation } from "../../util/element/relation";
import { clearTransFormer, getTran } from "../selectItem";
import { getCustomAttrs } from "@/main";

export default (ie: INLEDITOR, cb?: (node) => void) => {
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

    cb ? cb(e.target) : null;
  });
  // 结束拖动
  stage.on("dragend", (e: any) => {
    // 网格吸附
    let target;
    if (e.target.name() === "thingGroup" && ie.opt.adsorbent) {
      target = e.target.children.find((ele) => ele.name() === "thingImage");
      const sumX = e.target.x() + target.x();
      const sumY = e.target.y() + target.y();
      const change = {
        x: Math.round(sumX / ie.opt.step) * ie.opt.step - sumX,
        y: Math.round(sumY / ie.opt.step) * ie.opt.step - sumY,
      };

      e.target.setAttrs({
        x: e.target.x() + change.x,
        y: e.target.y() + change.y,
      });
    }
    if (target) {
      dealRelation(target, ie.getStage());
    }

    stage.batchDraw();
    // 历史
    ie.saveHistory();
    // 关闭辅助线
    closeSubLine.bind(ie)();
  });
};
