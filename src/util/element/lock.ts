import INLEDITOR from "@/index";
import Konva from "konva";

export const lockEle = (ie: INLEDITOR, node: Konva.Node, state: boolean) => {
  if (node.name() === "thingImage") {
    node.parent.setAttrs({ draggable: state });
  } else {
    node.setAttrs({ draggable: state });
  }
};
