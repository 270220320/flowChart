import { getTotalDistance } from "@/util/distance";
import Konva from "konva";
import LineAnimate from ".";

export default function (this: LineAnimate) {
  this.animateEl = new Konva.Arrow(this.opt.line.getAttrs());
  this.animateLayer.add(this.animateEl);
  let animate;
  const sign = this.opt.direction === "obey" ? -1 : 1;
  const width = this.opt.line.getAttr("strokeWidth");
  const dash = this.opt.line.getAttr("dash");

  this.opt.line.setAttrs({
    // 透明度，没dom会报错
    opacity: 0.5,
    strokeWidth: width * 2,
    dashEnabled: false,
  });
  this.animateEl.setAttrs({
    strokeWidth: width,
    dash: dash || [15, 8, 15, 8],
  });
  const distance = getTotalDistance(this.opt.line.points());
  const init = (i) => {
    animate = new Konva.Tween({
      node: this.animateEl,
      dashOffset: (i += sign * distance),
      duration: (this.speed * distance) / 500,
      onFinish: () => {
        if (this.runState) {
          init(i);
        }
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
    this.opt.line.setAttrs({
      opacity: 1,
      strokeWidth: width,
      dashEnabled: true,
    });
    this.animateEl.destroy();
  };
}
