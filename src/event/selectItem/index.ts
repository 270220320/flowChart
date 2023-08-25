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
import { groupNames } from "@/element";
import inputText from "@/element/texts/inputText";
import thing from "@/data/thing";

// 获取需要 框选的元素们
const getSelectNode = (selectTarget: Shape<ShapeConfig> | Stage) => {
  let resNode;
  if (
    selectTarget.getParent().name() === groupNames.thingTextGroup ||
    selectTarget.getParent().name() === groupNames.thingInputGroup ||
    selectTarget.getParent().name() === groupNames.thingSwitchGroup ||
    selectTarget.getParent().name() === groupNames.thingButtonGroup
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
export const createTran = (node: Konva.Node, ie: INLEDITOR) => {
  const name = node?.getAttrs().componentName;
  const opt: any = {
    // centeredScaling: true,
    rotateEnabled: false,
    rotationSnaps: [0, 90, 180, 270],
  };
  if (name === "BELT" || name === "Scraper" || name === "Technique") {
    opt.enabledAnchors = ["middle-right"];
    opt.rotateEnabled = false;
  } else if (node?.className === "Arrow") {
    opt.draggable = false;
    opt.resizeEnabled = false;
  } else if (
    node?.name() === "thingImage" ||
    node?.name() === groupNames.thingTextGroup ||
    node?.name() === groupNames.thingInputGroup ||
    node?.name() === groupNames.thingButtonGroup ||
    node?.name() === groupNames.thingSwitchGroup
  ) {
    opt.enabledAnchors = [
      "top-left",
      "top-right",
      "bottom-left",
      "bottom-right",
    ];
  } else if (
    node?.name() === "selfText" ||
    node?.name() === "customImage" ||
    node?.name() === "selfShape"
  ) {
  } else {
    opt.resizeEnabled = false;
  }
  const tran = new Konva.Transformer(opt);
  tran.on("transform", () => {
    ie.opt.onTransform?.();
  });
  return tran;
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
export const resetEvent = (stage: Konva.Stage) => {
  const Transformers = stage.findOne("Transformer") as Konva.Transformer;
  Transformers?.nodes().forEach((node) => {
    if (node.name() === "thingImage") {
      node.setAttrs({ draggable: false });
    }
  });
  const cursors = stage.find(".cursor");
  cursors.forEach((ele) => {
    inputText.blur(ele.parent);
  });
  Transformers?.remove();
  Transformers?.destroy();
};

export const clearTransFormer = (stage: Konva.Stage) => {
  const Transformers = stage.findOne("Transformer") as Konva.Transformer;
  Transformers?.remove();
  Transformers?.destroy();
  stage.draw();
};

export const toSelectOne = (ie: INLEDITOR, node: Konva.Node, cb?) => {
  const stage = ie.getStage();
  resetEvent(stage);
  const Transformers = createTran(node, ie);
  Transformers.nodes([node]);
  layer(stage, "util").add(Transformers);
  cb?.("things", {}, {});
  return Transformers;
};

export const toSelect = (ie: INLEDITOR, nodes: Array<Konva.Node>, cb?) => {
  if (nodes.length === 0) return;
  const stage = ie.getStage();
  resetEvent(stage);
  const Transformers = createTran(undefined, ie);
  Transformers.nodes(nodes);
  layer(stage, "util").add(Transformers);
  cb?.("things", {}, {});
  return Transformers;
};

// 选中单个元素动作
const selectEvent = (ie: INLEDITOR, e: KonvaEventObject<any>) => {
  const stage = ie.getStage();
  let Transformers = stage.findOne("Transformer") as Konva.Transformer;
  const node = getSelectNode(e.target);
  const nodes: Array<Konva.Node> = [];
  const cursors = stage.find(".cursor");
  cursors.forEach((ele) => {
    inputText.blur(ele.parent);
  });
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
    } else {
      node.setAttrs({ draggable: true });
      setTimeout(() => {
        node.setAttrs({ draggable: false });
      }, 3000);
    }
    const currentNodes = Transformers?.getNodes();
    if (currentNodes.length === 1) {
      currentNodes[0].setAttrs({ draggable: true });
    }
    Transformers.nodes([...currentNodes, node]);
    Transformers.draw();
  } else {
    // 没有按住shift

    resetEvent(stage);
    nodes.push(node);
    if (ie.opt.isPreview && node.name() === groupNames.thingInputGroup) {
      inputText.focus(node);
      return;
    }

    Transformers = createTran(node, ie);
    layer(stage, "util").add(Transformers);
    Transformers.nodes(nodes);
  }
};

export default (ie: INLEDITOR) => {
  const stage = ie.getStage();
  // 整体逻辑：如果点击画布直接清掉选择，如果是其他重置或者增加选择
  stage.on("click tap", (e) => {
    // 预览选择输入框
    if (
      ie.opt.isPreview &&
      e.target.getParent().name() !== groupNames.thingInputGroup
    ) {
      resetEvent(stage);
      return;
    }
    const layer = e.target.getLayer();
    // 判断一下当元素类型
    if (
      e.target.name() === "grid" ||
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
        selectEvent(ie, e);
    }
  });
};
