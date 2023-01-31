import Konva from "konva";
import INLEDITOR from "src";

export default (ie: INLEDITOR, e: KeyboardEvent) => {
  const Transformers = ie.stage.find("Transformer")[0] as Konva.Transformer;
  const nodes = Transformers.getNodes();
  for (let i of nodes) {
    const isThing = i.getParent().hasName("thingGroup");
    const isThingText = i.getParent().hasName("thingTextGroup");
    Transformers.destroy();

    if ((isThing && i.getClassName() === "Image") || isThingText) {
      i.getParent().remove();
    } else {
      i.remove();
    }
  }
};
