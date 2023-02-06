import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { Shape, ShapeConfig } from "konva/lib/Shape";
import { Stage } from "konva/lib/Stage";
import INLEDITOR from "src";

// 获取需要 框选的元素们
const getSelectNode = (selectTarget: Shape<ShapeConfig> | Stage) => {
  if (
    selectTarget.getParent().name() === "thingTextGroup" ||
    selectTarget.getLayer().name() === "createThingDefaultText"
  ) {
    return selectTarget.getParent();
  }
  return selectTarget;
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

// 重置事件中心
const resetEvent = (stage: Konva.Stage) => {
  const Transformers = stage.findOne("Transformer") as Konva.Transformer;
  Transformers?.destroy();
};

// 框选元素动作
const selectEvent = (stage: Konva.Stage, e: KonvaEventObject<any>) => {
  const flag = e.evt.ctrlKey;
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
    Transformers = new Konva.Transformer();
    layer.add(Transformers);
    Transformers.nodes(nodes);
  }
};

export default (ie: INLEDITOR) => {
  const { stage } = ie;

  stage.on("click tap", (e) => {
    const layer = e.target.getLayer();
    // 判断一下当元素类型
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
