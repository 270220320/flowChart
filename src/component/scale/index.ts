import Konva from "konva";
import INLEDITOR from "src";
import { createScaleGroup } from "src/component/scale/config";
import layer from "src/util/layer";
import theme, { Theme } from "../../config/theme";

interface ScaleOpt {
  ie: INLEDITOR;
}

interface Scale {
  opt: ScaleOpt;
}

class Scale {
  constructor(opt: ScaleOpt) {
    this.opt = opt;
    this.init();
  }
  init() {
    this.createDom();
    this.createStage();
    this.onChange();
  }

  syd!: HTMLDivElement;
  sxd!: HTMLDivElement;
  scaleX!: Konva.Stage;
  scaleY!: Konva.Stage;
  scaleLayerX!: Konva.Layer;
  scaleLayerY!: Konva.Layer;

  createScaleLine() {
    const width = this.opt.ie.stage.width();
    const height = this.opt.ie.stage.height();
    const zoom = this.opt.ie.stage.scaleX();
    const { x, y } = this.opt.ie.stage.position();
    const scaleTheme = theme[this.opt.ie.theme].scale; // 主题
    const fiveScale = 5;
    const maxw = 50;
    this.scaleLayerX.removeChildren();
    this.scaleLayerY.removeChildren();
    const { linesx, linesy } = this.computedSXY(
      width,
      height,
      x,
      y,
      fiveScale,
      maxw,
      scaleTheme
    );

    this.scaleLayerX.add(...linesx);
    this.scaleLayerY.add(...linesy);
  }

  computedSXY(
    width: number,
    height: number,
    offsetx: number,
    offsety: number,
    fiveScale: number,
    maxw: number,
    scaleTheme: any
  ) {
    const linesx = [];
    const { thickness } = scaleTheme;
    const xwww = width;
    for (let i = -xwww; i < xwww; i++) {
      const x = i * fiveScale;
      if (x % maxw == 0) {
        const cloneLine = new Konva.Line({
          points: [x, 2, x, thickness],
          stroke: scaleTheme.lineFill, //scale.lineFill,
          strokeWidth: 1,
          name: "line",
        });
        const cloneText = new Konva.Text({
          text: `${i}`,
          fontSize: 10,
          x: x + 2,
          y: 2,
        });
        linesx.push(cloneLine, cloneText);
      } else {
        linesx.push(
          new Konva.Line({
            points: [x, thickness / 1.5, x, thickness],
            stroke: scaleTheme.lineFill, // scale.lineFill,
            strokeWidth: 0.5,
            name: "line",
          })
        );
      }
    }

    const linesy = [];
    const ywww = height;
    for (let i = -ywww; i < ywww; i++) {
      const y = i * fiveScale;
      if (y % maxw == 0) {
        const text = new Konva.Text({
          text: `${i}`,
          fontSize: 10,
          x: 2,
          y,
        });
        text.setAttrs({
          y: y + text.width() + 2,
          rotation: -90,
        });

        linesy.push(
          new Konva.Line({
            points: [2, y, thickness, y],
            stroke: scaleTheme.lineFill, //scale.lineFill,
            strokeWidth: 1,
            name: "line",
          }),
          text
        );
      } else {
        linesy.push(
          new Konva.Line({
            points: [thickness / 1.5, y, thickness, y],
            stroke: scaleTheme.lineFill, // scale.lineFill,
            strokeWidth: 0.5,
            name: "line",
          })
        );
      }
    }

    return { linesx, linesy };
  }

  moveStageByCanvasOffset() {
    const { x, y } = this.opt.ie.stage.position();
    // this.scaleX.setAttrs({ x });
    var tween = new Konva.Tween({
      node: this.scaleX,
      x,
      duration: 0.01,
    });
    var tween2 = new Konva.Tween({
      node: this.scaleY,
      y,
      duration: 0.01,
    });
    tween2.play();

    tween.play();
  }

  onChange() {
    let n: number;
    this.opt.ie.stage.on("dragmove", (e) => {
      // 性能有点低, 可以优化.
      if (e.target === this.opt.ie.stage) {
        n ? clearTimeout(n) : null;
        n = setTimeout(() => {
          this.moveStageByCanvasOffset();
        }, 2);
      }
    });
  }

  createDom() {
    const dom = document.getElementById(this.opt.ie.opt.id);
    const { scale } = theme[this.opt.ie.theme];
    const scaleX = document.createElement("div");
    const scaleY = document.createElement("div");
    scaleX.id = "scalex";
    scaleX.setAttribute(
      "style",
      `top: 0; left: ${scale.thickness}px; overflow:hidden; right: 0; height: ${scale.thickness}px; position: absolute;z-index: 1;background:${scale.background};`
    );
    scaleY.setAttribute(
      "style",
      `top: ${scale.thickness}px; left: 0; overflow:hidden; bottom: 0; width: ${scale.thickness}px; position: absolute; z-index: 1; background:${scale.background};`
    );
    scaleY.id = "scaleY";
    dom?.appendChild(scaleX);
    dom?.appendChild(scaleY);
    this.sxd = scaleX;
    this.syd = scaleY;
  }
  createStage() {
    const width = this.opt.ie.stage.width();
    const height = this.opt.ie.stage.height();
    const scaleTheme = theme[this.opt.ie.theme].scale;
    this.scaleX = new Konva.Stage({
      width,
      height: scaleTheme.thickness,
      container: this.sxd,
    });
    this.scaleLayerX = new Konva.Layer({
      name: "scalelayerx",
    });
    this.scaleX.add(this.scaleLayerX);

    this.scaleY = new Konva.Stage({
      width: scaleTheme.thickness,
      height,
      container: this.syd,
    });
    this.scaleLayerY = new Konva.Layer({
      name: "scalelayery",
    });
    this.scaleY.add(this.scaleLayerY);

    this.createScaleLine();
  }
  destroy() {}
}

export default Scale;
