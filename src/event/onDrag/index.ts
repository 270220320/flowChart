import INLEDITOR from "../..";
import { closeSubLine, initSubLine } from "./subline";
import { dealRelation } from "../../util/element/relation";
import { clearTransFormer, getTran } from "../selectItem";
import { getCustomAttrs } from "@/main";
import Konva from "konva";
import layer from "@/util/layer";

export default (ie: INLEDITOR, cb?: (node) => void) => {
  const stage: Konva.Stage = ie.getStage();
  let imgs;
  stage.on("dragstart", (e: any) => {
    const transformer: Konva.Transformer = stage.findOne("Transformer");
    const nodes = transformer?.getNodes();
    if (nodes?.length > 1) {
      imgs = nodes.map((group: Konva.Group) =>
        group.children.find((node: Konva.Node) => node.name() === "thingImage")
      );
    }
  });
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
    const transformer: Konva.Transformer = stage.findOne("Transformer");
    const nodes = transformer?.getNodes();
    if (nodes?.length > 1) {
      if (e.target.getClassName() === "Transformer") {
        nodes.forEach((ele: Konva.Group) => {
          const img = ele.children.find(
            (ele: Konva.Node) => ele.name() === "thingImage"
          );
          dealRelation(img, ie.getStage(), imgs);
        });
      } else {
        const have = nodes.find((ele) => target.parent.id() === ele.id());
        if (have) {
          return;
        }
      }
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
