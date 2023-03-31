import Konva from "konva";

export const getImgNode = (node: Konva.Group) => {
  let res: Konva.Group = node;
  if (node.name() === "thingGroup") {
    res = node.children.find(
      (ele: Konva.Node) => ele.name() === "thingImage"
    ) as Konva.Group;
  }
  return res;
};
