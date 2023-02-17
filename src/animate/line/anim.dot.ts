import Konva from "konva";
import { computedDuration } from "../../util/distance";
import LineAnimate from ".";
import { lineAni } from "../../config";

export default function (this: LineAnimate) {
  const w = this.opt.line.getAttr("strokeWidth");
  let animate;
  let points = JSON.parse(JSON.stringify(this.opt.line.points())) || [];
  const animLength = points.length / 2; // 线段运动次数
  let { pointRes } = computedDuration(points, this.speed);
  if (this.opt.direction === "inverse") {
    pointRes.reverse();
  }
  const theme = this.opt.ie.getTheme();
  this.animateEl = new Konva.Circle({
    radius: w * 2,
    ...lineAni.dot[theme],
    x: points[0],
    y: points[1],
  });

  this.animateLayer.add(this.animateEl);
  const init = (index) => {
    const { x, y, duration } = pointRes[index];
    animate = new Konva.Tween({
      node: this.animateEl,
      x,
      y,
      duration,
      onFinish: () => {
        init(index < animLength - 1 ? (index += 1) : 0);
      },
    });
    animate.play();
  };
  this.start = () => {
    if (animate) {
      animate.play();
    } else {
      init(0);
    }
  };
  this.stop = () => {
    animate.pause();
  };
  this.destroy = () => {
    animate.pause();
    this.animateEl.remove();
  };
}
