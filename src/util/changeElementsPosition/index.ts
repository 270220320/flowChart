import Konva from "konva";
import { getTran } from "../../event/selectItem";
import computedXY from "../computedXY";
import { getImgNode } from "../element/getImgNode";
import { dealRelation } from "../element/relation";
import { AlignOpt, AlignType } from "./index.b";

export { AlignType };

const flip = {
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
const setElPosition: Record<
  AlignType,
  (
    nodes: Array<Konva.Node>,
    targetVal: Omit<AlignOpt, "nodeLength" | "index">
  ) => void
> = {
  flipY() {},
  flipX() {},
  moveToTop() {},
  moveToBottom() {},
  moveUp() {},
  moveDown() {},
  top(nodes, { minY }) {
    111;
    nodes.forEach((element) => {
      const { x } = element.getAbsolutePosition();
      element.setAbsolutePosition({
        x,
        y: minY,
      });
    });
  },
  left(nodes, { minX }) {
    nodes.forEach((element) => {
      const { y } = element.getAbsolutePosition();
      element.setAbsolutePosition({
        x: minX,
        y,
      });
    });
  },
  right(nodes, { maxX }) {
    nodes.forEach((element) => {
      const { x, y } = element.getAbsolutePosition();
      const w = element.width();
      const movex = x + (maxX - (x + w));

      element.setAbsolutePosition({
        x: movex,
        y,
      });
    });
  },
  bottom(nodes, { maxY }) {
    nodes.forEach((element) => {
      const { x, y } = element.getAbsolutePosition();
      const h = element.height();
      const movey = y + (maxY - (y + h));

      element.setAbsolutePosition({
        x,
        y: movey,
      });
    });
  },
  centerY(nodes, { maxY, minY }) {
    nodes.forEach((element) => {
      const { x, y } = element.getAbsolutePosition();
      const h = element.height();
      const target = minY + (maxY - minY) / 2;
      const movey = y + (target - y - h / 2);
      element.setAbsolutePosition({
        x,
        y: movey,
      });
    });
  },
  centerX(nodes, { minX, maxX }) {
    nodes.forEach((element) => {
      const { x, y } = element.getAbsolutePosition();
      const w = element.width();
      const target = minX + (maxX - minX) / 2;
      const movey = x + (target - x - w / 2);
      element.setAbsolutePosition({
        x: movey,
        y,
      });
    });
  },
  distributionY() {},
  distributionX() {},
};

export default (stage: Konva.Stage, type: AlignType) => {
  const { Transformers } = getTran(stage);
  const nodes = Transformers.nodes();

  // 翻转
  if (type === "flipX" || type === "flipY") {
    nodes.forEach((node) => {
      flip[type](node);
    });
    return;
  }

  // 层级
  if (
    type === "moveToTop" ||
    type === "moveToBottom" ||
    type === "moveUp" ||
    type === "moveDown"
  ) {
    nodes.forEach((node) => {
      if (node.name() === "thingImage") {
        node.parent[type]();
      }
    });
    return;
  }

  let minX = Number.MAX_VALUE,
    minY = Number.MAX_VALUE,
    maxY = Number.MIN_VALUE,
    maxX = Number.MIN_VALUE;
  const imgNodes = [];
  nodes.forEach((element: Konva.Group) => {
    // 如果是组转回thingImage
    const imgEle = getImgNode(element);
    imgNodes.push(imgEle);
    const { x, y } = computedXY(
      stage,
      imgEle.absolutePosition().x,
      imgEle.absolutePosition().y
    );
    const MAXX = x + imgEle.width();
    const MAXY = y + imgEle.height();
    if (MAXX > maxX) {
      maxX = MAXX;
    }
    if (MAXY > maxY) {
      maxY = MAXY;
    }
    if (x < minX) {
      minX = x;
    }
    if (minY > y) {
      minY = y;
    }
  });
  setElPosition[type](imgNodes, {
    maxX,
    maxY,
    minX,
    minY,
  });
  imgNodes.forEach((element) => {
    dealRelation(element, stage);
  });
};
