import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { Shape, ShapeConfig } from "konva/lib/Shape";
import { Stage } from "konva/lib/Stage";
import INLEDITOR from "@/index";
import { IRect } from "konva/lib/types";
import { isComponentChild } from "@/component";
import { getCustomAttrs } from "@/main";
import layer from "@/util/layer";
import { getParentThingGroup } from "@/util/element";

// 获取需要 框选的元素们
const getSelectNode = (selectTarget: Shape<ShapeConfig> | Stage) => {
  let resNode;
  if (
    selectTarget.getParent().name() === "thingTextGroup" ||
    selectTarget.getLayer().name() === "createThingDefaultText"
  ) {
    resNode = selectTarget.getParent();
  } else {
    // ???
    resNode = isComponentChild(selectTarget).node;
  }

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
  if (e.className === "Arrow") return "line";
  return type;
};

// 如果是线条 去做什么事儿
const isLine = () => {};

// 初始化选择框
export const createTran = (node?: Konva.Node) => {
  const name = node?.getAttrs().componentName;
  const opt: any = {
    // centeredScaling: true,
    rotateEnabled: false,
    rotationSnaps: [0, 90, 180, 270],
  };
  if (name === "BELT" || name === "Scraper" || name === "Technique") {
    opt.enabledAnchors = ["middle-right"];
    opt.rotateEnabled = false;
  }
  if (node?.getAttrs().name === "field") {
    opt.resizeEnabled = false;
  }
  return new Konva.Transformer(opt);
};
// 获取 选择框
export const getTran: (stage: Konva.Stage) => {
  nodes: Array<Konva.Node>;
  Transformers: Konva.Transformer;
  position?: IRect;
} = (s) => {
  const Transformers = s.findOne("Transformer") as Konva.Transformer;
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
  Transformers?.nodes().forEach((node) => {
    if (node.name() === "thingImage") {
      node.setAttrs({ draggable: false });
    }
  });
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
  layer(stage, "util").add(Transformers);
  cb?.("things", {}, {});
  return Transformers;
};

// 选中单个元素动作
const selectEvent = (stage: Konva.Stage, e: KonvaEventObject<any>) => {
  const flag = e.evt.shiftKey;
  let Transformers = stage.findOne("Transformer") as Konva.Transformer;
  const node = getSelectNode(e.target);
  const nodes: Array<Konva.Node> = [];
  // shift选中组,暂未去重
  if (e.evt.shiftKey && Transformers) {
    const currentNodes = Transformers?.getNodes() || [];
    const res = [...currentNodes, node].map((node) =>
      getParentThingGroup(node)
    );
    Transformers.nodes(res);
    Transformers.draw();
  } else if (e.evt.ctrlKey && Transformers) {
    if (node.name() !== "field") {
      node.setAttrs({ draggable: true });
    }

    const currentNodes = Transformers?.getNodes();
    Transformers.nodes([...currentNodes, node]);
    Transformers.draw();
  } else {
    // 没有按住shift
    Transformers?.destroy();
    nodes.push(node);
    Transformers = createTran(node);
    layer(stage, "util").add(Transformers);
    Transformers.nodes(nodes);
  }
};

export default (ie: INLEDITOR) => {
  const stage = ie.getStage();
  // 整体逻辑：如果点击画布直接清掉选择，如果是其他重置或者增加选择
  stage.on("click tap", (e) => {
    const layer = e.target.getLayer();
    // 判断一下当元素类型
    if (
      getCustomAttrs(e.target).type === "control" ||
      stage.attrs.drawState === "fieldSelect"
    )
      return;

    // const layer = stage.findOne(`.selectionBox`);
    if (!layer) {
      resetEvent(stage);
      return;
    }
    const tt = checkTarget(e.target);
    switch (tt) {
      // case "line":
      //   isLine();
      //   break;
      default:
        selectEvent(stage, e);
    }
  });
};
