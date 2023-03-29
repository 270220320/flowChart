import Konva from "konva";
import { getTran } from "../../event/selectItem";
import { AlignType } from "./index.b";

export { AlignType };

const setElPosition: Record<AlignType, any> = {
  moveToTop() {},
  moveToBottom() {},
  moveUp() {},
  moveDown() {},
  top() {},
  left(nodes) {
    let minX = Number.MAX_VALUE;
    nodes.forEach((element) => {
      const { x } = element.getAbsolutePosition();
      if (x < minX) {
        minX = x;
      }
    });
    nodes.forEach((element) => {
      const { y } = element.getAbsolutePosition();
      element.setAbsolutePosition({
        x: minX,
        y,
      });
    });
  },
  right(nodes: Array<Konva.Node>) {
    let maxX = Number.MIN_VALUE;
    nodes.forEach((element) => {
      const { x } = element.getAbsolutePosition();
      const XX = x + element.width();
      if (XX > maxX) {
        maxX = XX;
      }
    });
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
  bottom() {},
  centerY() {},
  centerX() {},
  flipX() {},
  distributionY() {},
  distributionX() {},
  flipY() {},
};

export default (stage: Konva.Stage, type: AlignType) => {
  const { Transformers } = getTran(stage);
  const nodes = Transformers.nodes();
  setElPosition[type](nodes);
};
