import INLEDITOR from "@/index";
import Konva from "konva";

export const lockEle = (node: Konva.Node, state: boolean) => {
  if (node.name() === "thingImage") {
    node.parent.setAttrs({ draggable: state });
  } else {
    node.setAttrs({ draggable: state });
  }
};
export const getLockState = (node: Konva.Node) => {
  if (node.name() === "thingImage") {
    return node.parent.attrs.draggable;
  } else {
    return node.attrs.draggable;
  }
};
