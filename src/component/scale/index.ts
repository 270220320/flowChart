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
    const fiveScale = 5 * zoom;
    const maxw = 50 * zoom;
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
    for (let i = 0; i < width / fiveScale; i++) {
      if ((i * fiveScale) % maxw == 0) {
        linesx.push(
          new Konva.Line({
            points: [i * fiveScale, 0, i * fiveScale, scaleTheme.thickness - 2],
            stroke: scaleTheme.lineFill, //scale.lineFill,
            strokeWidth: 1,
          })
        );
      } else {
        linesx.push(
          new Konva.Line({
            points: [i * fiveScale, 0, i * fiveScale, scaleTheme.thickness / 2],
            stroke: scaleTheme.lineFill, // scale.lineFill,
            strokeWidth: 0.5,
          })
        );
      }
    }

    const linesy = [];
    for (let i = 0; i < height / fiveScale; i++) {
      if ((i * fiveScale) % maxw == 0) {
        linesy.push(
          new Konva.Line({
            points: [0, i * fiveScale, scaleTheme.thickness - 2, i * fiveScale],
            stroke: scaleTheme.lineFill, //scale.lineFill,
            strokeWidth: 1,
          })
        );
      } else {
        linesy.push(
          new Konva.Line({
            points: [0, i * fiveScale, scaleTheme.thickness / 2, i * fiveScale],
            stroke: scaleTheme.lineFill, // scale.lineFill,
            strokeWidth: 0.5,
          })
        );
      }
    }

    return { linesx, linesy };
  }

  moveStageByCanvasOffset() {
    const { x, y } = this.opt.ie.stage.position();
    this.scaleX.setAttrs({ x });
    this.scaleY.setAttrs({ y });
  }

  onChange() {
    let n: number;
    this.opt.ie.stage.on("dragmove", () => {
      n ? clearTimeout(n) : null;
      n = setTimeout(() => {
        // 性能有点低, 可以优化.
        this.moveStageByCanvasOffset();
      }, 1);
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
      `top: 0; left: 0; right: 0; height: ${scale.thickness}px; position: absolute;z-index: 1;background:${scale.background};`
    );
    scaleY.setAttribute(
      "style",
      `top: 0; left: 0; bottom: 0; width: ${scale.thickness}px; position: absolute; z-index: 1; background:${scale.background};`
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
