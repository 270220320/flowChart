import { getTotalDistance } from "@/util/distance";
import Konva from "konva";
import LineAnimate from ".";
import { getCustomAttrs } from "@/util";

export default function (this: LineAnimate) {
  let animate;
  const sign = this.opt.direction === "obey" ? -1 : 1;
  const distance = getTotalDistance(this.opt.line.points());
  const init = (i) => {
    animate = new Konva.Tween({
      node: this.opt.line,
      dashOffset: (i += sign * distance),
      duration: (this.speed * distance) / 500,
      onFinish: () => {
        if (this.runState) {
          init(i);
        }
        return false;
      },
    });
    animate.play();
  };
  this.start = () => {
    this.runState = true;
    if (animate) {
      animate.play();
    } else {
      init(0);
    }
  };
  this.stop = () => {
    this.runState = false;
    animate.pause();
  };
  this.destroy = () => {
    this.runState = false;
    animate.pause();
  };
}
