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
    stage,
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
  top(stage, nodes, { minY }) {
    nodes.forEach((element: Konva.Group) => {
      const imgEle = getImgNode(element);
      const y = imgEle.absolutePosition().y / stage.scaleY();
      element.move({ x: 0, y: minY - y });
    });
  },
  bottom(stage, nodes, { maxY }) {
    nodes.forEach((element: Konva.Group) => {
      const imgEle = getImgNode(element);
      const MAXY =
        (imgEle.absolutePosition().y + imgEle.height()) / stage.scaleY();
      element.move({ x: 0, y: maxY - MAXY });
    });
  },
  left(stage, nodes, { minX }) {
    nodes.forEach((element: Konva.Group) => {
      const imgEle = getImgNode(element);
      const x = imgEle.absolutePosition().x / stage.scaleX();
      element.move({ x: minX - x, y: 0 });
    });
  },
  right(stage, nodes, { maxX }) {
    nodes.forEach((element: Konva.Group) => {
      const imgEle = getImgNode(element);
      const MAXX =
        (imgEle.absolutePosition().x + imgEle.width()) / stage.scaleX();
      element.move({ x: maxX - MAXX, y: 0 });
    });
  },

  centerY(stage, nodes, { maxY, minY }) {
    nodes.forEach((element: Konva.Group) => {
      const imgEle = getImgNode(element);
      const y = imgEle.absolutePosition().y / stage.scaleY();
      element.move({
        x: 0,
        y: (minY + maxY) / 2 - y - imgEle.height() / stage.scaleY() / 2,
      });
    });
  },
  centerX(stage, nodes, { minX, maxX }) {
    nodes.forEach((element: Konva.Group) => {
      const imgEle = getImgNode(element);
      const x = imgEle.absolutePosition().x / stage.scaleX();
      element.move({
        x: (minX + maxX) / 2 - x - imgEle.width() / stage.scaleX() / 2,
        y: 0,
      });
    });
  },
  distributionY(stage, nodes, { minY, maxY, totalY }) {
    const signal = (maxY - minY - totalY) / nodes.length;
    let counter = 0;
    nodes.forEach((element: Konva.Group, index: number) => {
      const imgEle = getImgNode(element);
      const y = imgEle.absolutePosition().y / stage.scaleY();
      element.move({
        x: 0,
        y: minY + counter + index * signal - y,
      });
      counter += imgEle.height() / stage.scaleY();
    });
  },
  distributionX(stage, nodes, { minX, maxX, totalX }) {
    const signal = (maxX - minX - totalX) / nodes.length;
    let counter = 0;
    nodes.forEach((element: Konva.Group, index: number) => {
      const imgEle = getImgNode(element);
      const x = imgEle.absolutePosition().x / stage.scaleX();
      element.move({
        x: minX + counter + index * signal - x,
        y: 0,
      });
      counter += imgEle.width() / stage.scaleX();
    });
  },
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
    stage.findOne("#field")?.moveToBottom();
    return;
  }

  let minX = Number.MAX_VALUE,
    minY = Number.MAX_VALUE,
    maxY = Number.MIN_VALUE,
    maxX = Number.MIN_VALUE,
    totalX = 0,
    totalY = 0;
  const imgNodes = [];
  nodes.forEach((thingGroup: Konva.Group) => {
    // 如果是组转回thingImage
    const imgEle = getImgNode(thingGroup);
    imgNodes.push(imgEle);

    const x = imgEle.absolutePosition().x / stage.scaleX();
    const y = imgEle.absolutePosition().y / stage.scaleY();
    const MAXX =
      (imgEle.absolutePosition().x + imgEle.width()) / stage.scaleX();
    const MAXY =
      (imgEle.absolutePosition().y + imgEle.height()) / stage.scaleY();
    totalX += imgEle.width() / stage.scaleX();
    totalY += imgEle.height() / stage.scaleY();
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
  setElPosition[type](stage, nodes, {
    maxX,
    maxY,
    minX,
    minY,
    totalX,
    totalY,
  });
  imgNodes.forEach((element) => {
    dealRelation(element, stage);
  });
};
