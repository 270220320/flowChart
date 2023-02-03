import Konva from "konva";
import { Shape, ShapeConfig } from "konva/lib/Shape";
import { Stage } from "konva/lib/Stage";
import INLEDITOR from "src";

const resetSelectNode = (selectTarget: Shape<ShapeConfig> | Stage) => {
  if (
    selectTarget.getParent().name() !== "thing" &&
    selectTarget.getLayer().name() === "thing"
  ) {
    return selectTarget.getParent();
  }
  return selectTarget;
};

export default (ie: INLEDITOR) => {
  let flag = false;
  const { stage, container } = ie;
  container.addEventListener("keydown", (e) => {
    if (e.key === "Shift") {
      flag = true;
    }
  });
  container.addEventListener("keyup", (e) => {
    flag = false;
  });
  stage.on("click tap", (e) => {
    let Transformers = stage.findOne("Transformer") as Konva.Transformer;
    const nodes: Array<Konva.Node> = [];
    const layer = e.target.getLayer();
    if (!layer) {
      Transformers?.destroy();
      return;
    }
    const node = resetSelectNode(e.target);
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
    layer.draw();
  });
};
