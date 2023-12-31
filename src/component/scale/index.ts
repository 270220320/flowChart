import Konva from "konva";
import { ComponentFac } from "../componentFac";
import theme from "../../config/theme";

interface ScaleOpt {}

interface Scale {
  opt: ScaleOpt;
}

// 刻度尺
class Scale extends ComponentFac {
  name = "scale";
  constructor(editor) {
    super(editor.getStage());
    this.editor = editor;
    this.createDom();
    this.createStage();
    this.onChange();
  }
  visible = true;

  syd!: HTMLDivElement;
  sxd!: HTMLDivElement;
  scaleX!: Konva.Stage;
  scaleY!: Konva.Stage;
  scaleLayerX!: Konva.Layer;
  scaleLayerY!: Konva.Layer;

  hide() {
    this.scaleX.visible(false);
    this.scaleY.visible(false);
    this.sxd.style.display = "none";
    this.syd.style.display = "none";
    this.visible = false;
  }
  show() {
    this.scaleX.visible(true);
    this.scaleY.visible(true);
    this.sxd.style.display = "block";
    this.syd.style.display = "block";
    this.visible = true;
  }
  changeVisable() {
    if (this.visible) {
      this.hide();
    } else {
      this.show();
    }
  }

  render() {
    this.syd.innerHTML = "";
    this.sxd.innerHTML = "";
    this.createStage();
    this.onChange();
  }
  createScaleLine() {
    const stage = this.editor.getStage();
    const themeType = this.editor.getTheme();
    const width = stage.width() / 2;
    const height = stage.height();
    const zoom = stage.scaleX();
    const { x, y } = stage.position();
    const scaleTheme = theme[themeType].scale; // 主题
    const fiveScale = 10;
    const maxw = 100;
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
    let cl = new Konva.Line({
      points: [],
      stroke: scaleTheme.lineFill,
      strokeWidth: 1,
      name: "line",
    });
    let ct = new Konva.Text({
      text: ``,
      fontSize: 10,
      y: 2,
    });
    cl.cache();
    // ct.cache();

    const linesx = [];
    const { thickness } = scaleTheme;
    const xwww = width;
    for (let i = -xwww; i < xwww; i++) {
      const x = i * fiveScale;

      if (x % maxw == 0) {
        // 大刻度
        const cloneLine = cl.clone({ points: [x, 2, x, thickness] });
        const cloneText = ct.clone({ x: x + 2, text: i * 10 });
        linesx.push(cloneLine, cloneText);
      } else {
        // 小刻度
        const cloneLine = cl.clone({
          points: [x, thickness / 1.5, x, thickness],
          strokeWidth: 0.5,
        });
        linesx.push(cloneLine);
      }
    }

    const linesy = [];
    const ywww = height;
    for (let i = -ywww; i < ywww; i++) {
      const y = i * fiveScale;
      if (y % maxw == 0) {
        const text = ct.clone({ y, x: 2, text: i * 10 });
        text.setAttrs({
          y: y + text.width() + 2,
          rotation: -90,
        });
        const cloneLine = cl.clone({
          points: [2, y, thickness, y],
        });
        linesy.push(cloneLine, text);
      } else {
        const cloneLine = cl.clone({
          points: [thickness / 1.5, y, thickness, y],
          strokeWidth: 0.5,
        });
        linesy.push(cloneLine);
      }
    }

    return { linesx, linesy };
  }

  moveStageByCanvasOffset() {
    const { x, y } = this.editor.getStage().position();
    this.scaleX.setPosition({ x, y: 0 });
    this.scaleY.setPosition({ x: 0, y });
  }

  onChange() {
    let n: any;
    const stage = this.editor.getStage();
    stage.on("dragmove", (e) => {
      // 性能有点低, 可以优化.
      if (e.target === stage) {
        n ? clearTimeout(n) : null;
        n = setTimeout(() => {
          this.moveStageByCanvasOffset();
        }, 1);
      }
    });
  }

  createDom() {
    const dom = document.getElementById(this.editor.opt.id);
    const themeType = this.editor.getTheme();
    const { scale } = theme[themeType];
    const scaleX = document.createElement("div");
    const scaleY = document.createElement("div");
    scaleX.id = "scalex";
    // left: ${scale.thickness}px;
    scaleX.setAttribute(
      "style",
      `top: 0; overflow: hidden; left: 0px; right: 0;height: ${scale.thickness}px; position: absolute; z-index: 1;background:${scale.background};`
    );
    scaleY.setAttribute(
      "style",
      `top: 0px; left: 0; overflow:hidden; bottom: 0; width: ${scale.thickness}px; position: absolute; z-index: 1; background:${scale.background};`
    );
    scaleY.id = "scaleY";
    dom?.appendChild(scaleX);
    dom?.appendChild(scaleY);
    this.sxd = scaleX;
    this.syd = scaleY;
  }
  createStage() {
    const stage = this.editor.getStage();
    const themeType = this.editor.getTheme();
    const width = stage.width();
    const height = stage.height();
    const scaleTheme = theme[themeType].scale;
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

export { Scale };
