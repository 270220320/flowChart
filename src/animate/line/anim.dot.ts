import Konva from "konva";
import { computedDuration } from "../../util/distance";
import LineAnimate from ".";
import { aniLineState, lineAni, lineState } from "../../config";
import { getLineInfo } from "@/util/customAttr";

export default function (this: LineAnimate) {
  const lineInfo = getLineInfo(this.opt.line);
  const width = this.opt.line.getAttr("strokeWidth");
  let animate;
  let points = JSON.parse(JSON.stringify(this.opt.line.points())) || [];
  const animLength = points.length / 2; // 线段运动次数
  const { distance } = computedDuration(points, this.speed);
  let { pointRes } = computedDuration(points, (this.speed * distance) / 500);
  if (this.opt.direction === "inverse") {
    pointRes.reverse();
  }
  const theme = this.opt.ie.getTheme();
  this.opt.line.setAttrs({
    stroke: aniLineState[theme][lineInfo.state],
    fill: aniLineState[theme][lineInfo.state],
    strokeWidth: width * 2,
  });
  this.animateEl = new Konva.Circle({
    radius: width,
    ...lineAni.dot[theme],
    fill: lineState[theme][lineInfo.state],
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
    if (this.runState) {
      return;
    }
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
      stroke: lineState[theme][lineInfo.state],
      fill: lineState[theme][lineInfo.state],
      strokeWidth: width,
    });
    this.animateEl.remove();
  };
}
