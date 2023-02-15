import Konva from "konva";
import { getTran } from "../../event/selectItem";

export type AlignType =
  | "top"
  | "left"
  | "right"
  | "bottom"
  | "centerY"
  | "centerX"
  | "flipX"
  | "distributionY"
  | "distributionX"
  | "flipY";
type AlignOpt = {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  index: number;
  nodeLength: number;
};

const align = {
  top(node: Konva.Node, opt: AlignOpt) {
    node.setAbsolutePosition({ y: opt.minY, x: node.getAbsolutePosition().x });
  },
  bottom(node: Konva.Node, opt: AlignOpt) {
    node.setAbsolutePosition({
      y: opt.maxY - node.height(),
      x: node.getAbsolutePosition().x,
    });
  },
  right(node: Konva.Node, opt: AlignOpt) {
    node.setAbsolutePosition({
      x: opt.maxX - node.width(),
      y: node.getAbsolutePosition().y,
    });
  },
  left(node: Konva.Node, opt: AlignOpt) {
    node.setAbsolutePosition({ x: opt.minX, y: node.getAbsolutePosition().y });
  },
  // 垂直居中
  centerY(node: Konva.Node, opt: AlignOpt) {
    const { minY, maxY } = opt;
    const Y = minY + (maxY - minY) / 2;
    node.setAbsolutePosition({
      y: Y - node.height() / 2,
      x: node.getAbsolutePosition().x,
    });
  },
  distributionY(node) {},
  distributionX(node: Konva.Node, opt: AlignOpt) {
    const { index, maxX, minX, nodeLength } = opt;
    const px = minX + ((maxX - minX) / nodeLength) * index;
    const { x, y } = node.getAbsolutePosition();
    node.setAbsolutePosition({
      x: px - node.width() / 2,
      y: y,
    });
  },
  // 水平居中
  centerX(node: Konva.Node, opt: AlignOpt) {
    const { minX, maxX } = opt;
    const X = minX + (maxX - minX) / 2;
    node.setAbsolutePosition({
      x: X - node.width() / 2,
      y: node.getAbsolutePosition().y,
    });
  },
  flipX(node: Konva.Node) {
    const x = node.scaleX();
    const w = node.width();
    node.scaleX(-x);
    node.offsetX(-x < 0 ? w : 0);
  },
  flipY(node: Konva.Node) {
    const y = node.scaleY();
    const w = node.width();
    node.scaleY(-y);
    node.offsetY(-y < 0 ? w : 0);
  },
};

export default (stage: Konva.Stage, type: AlignType) => {
  const { nodes } = getTran(stage);

  if (type === "flipX" || type === "flipY") {
    nodes.forEach((node) => {
      align[type](node);
    });
    return;
  }
  let minX = nodes[0].absolutePosition().x;
  let minY = nodes[0].absolutePosition().y;
  let maxY = nodes[0].absolutePosition().y + nodes[0].height();
  let maxX = nodes[0].absolutePosition().x + nodes[0].width();
  for (let i of nodes) {
    minX = Math.min(minX, i.getAbsolutePosition().x);
    minY = Math.min(minY, i.getAbsolutePosition().y);
    maxY = Math.max(maxY, i.getAbsolutePosition().y + i.height());
    maxX = Math.max(maxX, i.getAbsolutePosition().y + i.width());
  }

  let index = 0;
  for (let i of nodes) {
    index++;
    let node = i;
    if (i.hasName("val")) {
      node = i.parent;
    }
    align[type](node, {
      minX,
      minY,
      maxY,
      maxX,
      index,
      nodeLength: nodes.length,
    });
  }
};
