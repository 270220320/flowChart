import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { Shape, ShapeConfig } from "konva/lib/Shape";
import { Stage } from "konva/lib/Stage";
import INLEDITOR from "@/index";
import { IRect } from "konva/lib/types";
import { isComponentChild } from "@/component";
import { getCustomAttrs } from "@/main";

// 获取需要 框选的元素们
const getSelectNode = (selectTarget: Shape<ShapeConfig> | Stage) => {
  let resNode;
  if (
    selectTarget.getParent().name() === "thingTextGroup" ||
    selectTarget.getLayer().name() === "createThingDefaultText"
  ) {
    resNode = selectTarget.getParent();
  }
  resNode = isComponentChild(selectTarget).node;
  // if (resNode.name() === "thingImage") {
  //   resNode = resNode.parent;
  // }
  return resNode;
};

/**
 * 判断当前元素类型
 */
type TargetType = "line" | "other" | "thing";
const checkTarget: (selectTarget: Shape<ShapeConfig> | Stage) => TargetType = (
  e
) => {
  let type: TargetType = "other";
  if (e.className === "Line") return "line";
  return type;
};

// 如果是线条 去做什么事儿
const isLine = () => {};

// 初始化选择框
export const createTran = (enabledAnchors?: []) =>
  new Konva.Transformer({
    // centeredScaling: true,
    enabledAnchors,
    rotationSnaps: [0, 90, 180, 270],
  });
// 获取 选择框
export const getTran: (stage: Konva.Stage) => {
  nodes: Array<Konva.Node>;
  Transformers: Konva.Transformer;
  position?: IRect;
} = (s) => {
  const Transformers = s.findOne("Transformer") as Konva.Transformer;
  debugger;
  if (!Transformers) return { nodes: [], Transformers: null };

  return {
    nodes: Transformers.getNodes(),
    position: Transformers.getClientRect(),
    Transformers,
  };
};
// 重置事件中心
const resetEvent = (stage: Konva.Stage) => {
  const Transformers = stage.findOne("Transformer") as Konva.Transformer;
  Transformers?.destroy();
};

export const clearTransFormer = (stage: Konva.Stage) => {
  const Transformers = stage.findOne("Transformer") as Konva.Transformer;
  Transformers?.remove();
  Transformers?.destroy();
  stage.draw();
};

export const toSelect = (stage: Konva.Stage, nodes: Array<Konva.Node>, cb?) => {
  if (nodes.length === 0) return;
  resetEvent(stage);
  const Transformers = createTran();
  Transformers.nodes(nodes);
  nodes[0].getLayer().add(Transformers);
  cb?.("things", {}, {});
};

// 框选元素动作
const selectEvent = (stage: Konva.Stage, e: KonvaEventObject<any>) => {
  const flag = e.evt.shiftKey;
  let Transformers = stage.findOne("Transformer") as Konva.Transformer;
  const node = getSelectNode(e.target);
  const nodes: Array<Konva.Node> = [];
  const layer = e.target.getLayer();
  if (flag) {
    const nodes1 = Transformers.getNodes();
    Transformers.nodes([...nodes1, node]);
    Transformers.draw();
  } else {
    // 没有按住shift
    Transformers?.destroy();
    nodes.push(node);
    let anchors;
    if (node.getAttrs().componentName === "belt") {
      anchors = ["middle-right"];
    }
    Transformers = createTran(anchors);
    layer.add(Transformers);
    Transformers.nodes(nodes);
  }
};

export default (ie: INLEDITOR) => {
  const stage = ie.getStage();

  stage.on("click tap", (e) => {
    const layer = e.target.getLayer();
    // 判断一下当元素类型
    if (getCustomAttrs(e.target).type === "control") return;
    if (!layer) {
      resetEvent(stage);
      return;
    }
    const tt = checkTarget(e.target);

    switch (tt) {
      case "line":
        isLine();
        break;
      default:
        selectEvent(stage, e);
    }

    layer.draw();
  });
};
