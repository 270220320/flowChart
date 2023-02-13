import Konva from "konva";
import { IRect } from "konva/lib/types";
import { getTran } from "../../event/selectItem";

export type AlignType =
  | "top"
  | "left"
  | "right"
  | "bottom"
  | "center"
  | "verticalMiddle"
  | "flipX"
  | "flipY";
export type AlignOpt = {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
};

const align = {
  top(node: Konva.Node, opt: AlignOpt) {
    node.setAttr("y", opt.minY);
  },
  bottom(node: Konva.Node, opt: AlignOpt) {
    node.setAttr("y", opt.maxY);
  },
  right(node: Konva.Node, opt: AlignOpt) {
    node.setAttr("x", opt.maxX);
  },
  left(node: Konva.Node, opt: AlignOpt) {
    node.setAttr("x", opt.minX);
  },
};

export default (stage: Konva.Stage, type: AlignType) => {
  const { nodes, position } = getTran(stage);
  const { x, y, height, width } = position;
  let minX = x;
  let minY = y;
  let maxX = width + x;
  let maxY = y + height;
  let rect: IRect;
  for (let i of nodes) {
    rect = i.getClientRect();
    minX = Math.min(minX, rect.x);
    minY = Math.min(minY, rect.y);
    maxX = Math.max(maxX, rect.x + rect.width);
    maxY = Math.max(maxY, rect.y + rect.height);
  }
  for (let i of nodes) {
    let node = i;
    if (i.hasName("val")) {
      node = i.parent;
    }
    align[type](node, { minX, minY, maxX, maxY });
  }
};
