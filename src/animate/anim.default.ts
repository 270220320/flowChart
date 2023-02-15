import Konva from "konva";
import LineAnimate from ".";

export default function (this: LineAnimate) {
  this.animateEl = new Konva.Line(this.opt.line.getAttrs());
  this.animateLayer.add(this.animateEl);
  const sign = this.opt.direction === "obey" ? -1 : 1;
  const bc = "lightskyblue";
  this.animateEl.setAttrs({
    stroke: bc,
    strokeWidth: this.opt.line.getAttr("strokeWidth") * 1.5,
    dash: [10, 0, 10],
  });
  const anim = (i) => {
    this.animateEl.to({
      dashOffset: (i += sign * this.speed),
      duration: 0.1,
      onFinish: () => {
        anim(i);
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
