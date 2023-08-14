import { getTotalDistance } from "@/util/distance";
import Konva from "konva";
import LineAnimate from ".";
import { getCustomAttrs } from "@/util";
import pipeAni from "./anim.pipeline";

export default function (this: LineAnimate) {
  const info = getCustomAttrs(this.opt.line);
  if (info.lineInfo.type.toLowerCase().indexOf("dotted") === -1) {
    pipeAni.bind(this)();
    return;
  }

  this.animateEl = new Konva.Arrow(this.opt.line.getAttrs());
  this.animateLayer.add(this.animateEl);
  let animate;
  const sign = this.opt.direction === "obey" ? -1 : 1;
  const width = this.opt.line.getAttr("strokeWidth");
  const dash = this.opt.line.getAttr("dash");

  this.opt.line.setAttrs({
    // 透明度，没dom会报错
    // opacity: 0.5,
    strokeWidth: width * 2,
    dashEnabled: false,
  });
  this.opt.line.cache();
  this.opt.line.filters([Konva.Filters.HSL, Konva.Filters.Enhance]);
  if (this.opt.ie.getTheme() === "dark") {
    this.opt.line.luminance(-0.5);
    this.opt.line.saturation(-0.3);
  } else {
    this.opt.line.luminance(0.5);
    this.opt.line.saturation(0.3);
  }

  this.animateEl.setAttrs({
    strokeWidth: width * 0.8,
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
        return false;
      },
    });
    animate.play();
  };
  this.start = () => {
    this.animateEl.moveToTop();
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
    this.opt.line.luminance(0);
    this.opt.line.saturation(0);
    this.opt.line.enhance(0);
    this.opt.line.setAttrs({
      strokeWidth: width,
      dashEnabled: true,
    });
    this.opt.line.clearCache();

    this.animateEl.destroy();
  };
}
