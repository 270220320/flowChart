import { getTotalDistance } from "@/util/distance";
import Konva from "konva";
import LineAnimate from ".";

export default function (this: LineAnimate) {
  this.animateEl = new Konva.Line(this.opt.line.getAttrs());
  this.animateLayer.add(this.animateEl);
  let animate;
  const sign = this.opt.direction === "obey" ? -1 : 1;
  const bc = "lightskyblue";
  this.animateEl.setAttrs({
    stroke: bc,
    strokeWidth: this.opt.line.getAttr("strokeWidth") * 1.5,
    dash: [10, 0, 10],
  });
  const distance = getTotalDistance(this.opt.line.points());
  const init = (i) => {
    animate = new Konva.Tween({
      node: this.animateEl,
      dashOffset: (i += sign * distance),
      duration: this.speed,
      onFinish: () => {
        init(i);
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
