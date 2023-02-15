import Konva from "konva";
import LineAnimate from ".";

export default function (this: LineAnimate) {
  this.animateEl = new Konva.Line(this.opt.line.getAttrs()).hide();
  this.animateLayer.add(this.animateEl);
  const n = this.opt.direction === "obey" ? -1 : 1;
  const bc = "rgb(35 128 246 / 28%)";
  const qc = "red";
  this.animateEl.setAttrs({
    stroke: qc,
  });
  this.opt.line.setAttrs({
    stroke: bc,
    strokeWidth: this.opt.line.getAttr("strokeWidth") * 1.5,
    dash: [0, 0],
  });
  const anim = (i) => {
    debugger;
    this.animateEl.to({
      dashOffset: (i += n * this.speed),
      duration: 1,
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
