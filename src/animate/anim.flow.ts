import Konva from "konva";
import { computedDuration } from "../util/distance";
import LineAnimate from ".";

const BASEDURATION = 100;
export default function (this: LineAnimate) {
  this.animateEl = new Konva.Line(this.opt.line.getAttrs());
  this.animateLayer.add(this.animateEl);
  let flag = true;
  const sign = this.opt.direction === "obey" ? 1 : -1;
  const bc = "rgb(35 128 246 / 28%)";
  const qc = "red";
  let points = JSON.parse(JSON.stringify(this.opt.line.points())) || [];
  const { distance } = computedDuration(points, 5);
  this.animateEl.setAttrs({
    stroke: qc,
    dash: [distance],
    dashOffset: distance,
  });
  this.opt.line.dash([0, 0]).setAttr("stroke", bc);
  const anim = () => {
    this.animateEl.to({
      dashOffset: sign ? 0 : distance * sign,
      duration: (distance / BASEDURATION) * this.speed, // + this.speed
      onFinish: () => {
        if (flag) {
          this.animateEl.setAttrs({ dashOffset: distance });
          anim();
        }
      },
    });
  };
  return {
    start() {
      flag = true;
      anim();
    },
    stop() {
      flag = false;
    },
    destroy() {},
  };
}
