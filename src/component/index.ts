import Konva from "konva";

export * from "./belt";
export * from "./grid";
export * from "./scale";
export * from "./minmap";

export const isComponentChild = (node: Konva.Node) => {
  const parent = node.parent;
  const parentName = parent.name();

  return {
    node: parentName === "thingImage" ? parent : node,
  };
};
