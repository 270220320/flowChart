import layer from "@/util/layer";
import Konva from "konva";
import { Group } from "konva/lib/Group";
import { Shape, ShapeConfig } from "konva/lib/Shape";
import INLEDITOR from "../..";
// import { EDITORLINELAYNAME } from "../../draw/line/line.config";
import animDefault from "./anim.default";
import animDot from "./anim.dot";
import animFlow from "./anim.flow";

export enum LineAnimateType {
  "default", // 默认虚线流动
  "flow", // 水流
  "dot", // 圆点动画
}

interface LineAnimateOpt {
  line: Konva.Arrow;
  ie: INLEDITOR;
  direction: "inverse" | "obey";
  animateType: keyof typeof LineAnimateType;
  speed?: number;
}

interface LineAnimate {
  opt: LineAnimateOpt;
  start: () => void;
  stop: () => void;
  destroy: () => void;
}

class LineAnimate {
  constructor(opt: LineAnimateOpt) {
    this.opt = opt;
    this.speed = opt.speed || this.speed;
    this.init();
  }
  animateLayer!: Konva.Layer;
  animateEl!: Group | Shape<ShapeConfig>;
  start = () => {};
  stop = () => {};
  runState = false;
  destroy = () => {};
  opt!: LineAnimateOpt;
  init() {
    this.reset();
  }
  speed = 5;
  resetAnimate: Record<
    keyof typeof LineAnimateType,
    () => { start: () => void; stop: () => void }
  > = {
    default: animDefault.bind(this),
    flow: animFlow.bind(this),
    dot: animDot.bind(this),
  };
  reset() {
    const stage = this.opt.ie.getStage();
    this.animateLayer = layer(stage, "line");
    this.resetAnimate[this.opt.animateType || "default"]();
    this.start();
  }
}

export default LineAnimate;
