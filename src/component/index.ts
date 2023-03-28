import Konva from "konva";

export * from "./belt";
export * from "./grid";
export * from "./scale";
export * from "./minmap";
export * from "./pool";
export * from "./video";
export * from "./scraper";
export * from "./storeHouse";

export const isComponentChild = (node: Konva.Node) => {
  const parent = node.parent;
  const parentName = parent.name();

  return {
    node: parentName === "thingImage" ? parent : node,
  };
};

export const isComponentChildren = (node: Konva.Node) => {
  return node?.parent?.parent?.name() === "thingGroup";
};

export const componentsName = ["POOL", "SCRAPER", "BELT", "ROUND_BUNKER"];
