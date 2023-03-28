import Konva from "konva";
import { computedDuration } from "../../util/distance";
import LineAnimate from ".";
import { aniLineState, lineAni, lineState } from "../../config";
import { getLineInfo } from "@/util/customAttr";

export default function (this: LineAnimate) {
  const lineInfo = getLineInfo(this.opt.line);
  this.animateEl = new Konva.Arrow(this.opt.line.getAttrs());
  this.animateLayer.add(this.animateEl);
  let animate;
  const sign = this.opt.direction === "obey" ? 1 : -1;
  let points = JSON.parse(JSON.stringify(this.opt.line.points())) || [];
  const { distance } = computedDuration(points, this.speed);
  const theme = this.opt.ie.getTheme();
  const width = this.opt.line.getAttr("strokeWidth");
  this.opt.line.setAttrs({
    stroke: aniLineState[theme][lineInfo.state],
    fill: aniLineState[theme][lineInfo.state],
    strokeWidth: width * 2,
  });
  this.animateEl.setAttrs({
    ...lineAni.flow[theme],
    stroke: lineState[theme][lineInfo.state],
    fill: lineState[theme][lineInfo.state],
    dash: [distance],
    dashOffset: distance,
    strokeWidth: width,
  });
  const init = () => {
    animate = new Konva.Tween({
      node: this.animateEl,
      dashOffset: sign ? 0 : distance * sign,
      duration: (this.speed * distance) / 500,
      onFinish: () => {
        this.animateEl.setAttrs({ dashOffset: distance });
        init();
      },
    });
    animate.play();
  };
  this.start = () => {
    if (this.runState) {
      return;
    }
    this.runState = true;
    if (animate) {
      animate.play();
    } else {
      init();
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
      stroke: lineState[theme][lineInfo.state],
      fill: lineState[theme][lineInfo.state],
      strokeWidth: width,
    });
    this.animateEl.remove();
  };
}
