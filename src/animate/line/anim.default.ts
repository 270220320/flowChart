import { getLineInfo } from "@/util/customAttr";
import { getTotalDistance } from "@/util/distance";
import Konva from "konva";
import LineAnimate from ".";
import { aniLineState, lineAni } from "../../config";

export default function (this: LineAnimate) {
  this.animateEl = new Konva.Arrow(this.opt.line.getAttrs());
  const lineInfo = getLineInfo(this.opt.line);
  this.animateLayer.add(this.animateEl);
  let animate;
  const sign = this.opt.direction === "obey" ? -1 : 1;
  const theme = this.opt.ie.getTheme();
  this.animateEl.setAttrs({
    ...lineAni.dotted[theme],
    stroke: aniLineState[theme][lineInfo.state],
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
