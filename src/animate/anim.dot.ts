import Konva from "konva";
import { computedDuration } from "../util/distance";
import LineAnimate from ".";

export default function (this: LineAnimate) {
  const w = this.opt.line.getAttr("strokeWidth");
  const flag = true;
  let points = JSON.parse(JSON.stringify(this.opt.line.points())) || [];
  const animLength = points.length / 2; // 线段运动次数
  let { point2 } = computedDuration(points, this.speed);
  if (this.opt.direction === "inverse") {
    point2.reverse();
  }
  this.animateEl = new Konva.Circle({
    radius: w * 2,
    fill: "#2380f6",
    x: points[0],
    y: points[1],
  });

  this.animateLayer.add(this.animateEl);
  const anim = (index: number) => {
    const { x, y, duration } = point2[index];
    this.animateEl.to({
      x,
      y,
      duration,
      onFinish() {
        if (flag) {
          anim(index < animLength - 1 ? (index += 1) : 0);
        }
      },
    });
  };
  return {
    start() {
      anim(0);
    },
    stop() {},
    destroy() {},
  };
}
