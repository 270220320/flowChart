import { getCustomAttrs } from "@/main";
import computedXY from "@/util/computedXY";
import layer from "@/util/layer";
import Konva from "konva";
import drawCoal from "./drawCoal";

interface COALANIM {
  autoPlay: boolean;
  animEl: Konva.Node;
  stage: Konva.Stage;
  animGroup: Konva.Group;
  cacheCoal: Konva.Star | Konva.Image;
  tim: any;
  movejl: number;
}

interface OPT {
  stage: Konva.Stage;
  uuid: string;
  imgUrl?: string;
  autoPlay?: boolean;
}
class COALANIM {
  constructor(opt: OPT) {
    const { autoPlay, stage, uuid, imgUrl } = opt;
    this.autoPlay = autoPlay || false;
    this.stage = stage;

    this.init(autoPlay, uuid, imgUrl);
  }
  async init(autoPlay, uuid, imgUrl) {
    await this.reset(uuid, imgUrl);

    if (autoPlay) {
      this.start();
    }
  }

  movejl = 0;

  async reset(uuid: string, imgUrl: string) {
    this.cacheCoal = await drawCoal(imgUrl);
    this.cacheCoal.cache();
    const layerthing = layer(this.stage, "thing");
    this.animEl = (layerthing.findOne(`#${uuid}`) as Konva.Group).findOne(
      ".thingImage"
    );

    if (!this.animEl) {
      new Error("未查询到元素，请检查查询条件.");
      return;
    }
    const { width, height } = this.animEl.getClientRect();
    const point = this.animEl.getAbsolutePosition();
    const { x, y } = computedXY(this.stage, point.x, point.y);

    const scale = this.stage.scaleX();

    this.animGroup = new Konva.Group({
      width: width / scale,
      height: height / scale,
      x,
      y: y - height / scale,
    });

    layerthing.add(this.animGroup);
    layerthing.draw();
    const state = getCustomAttrs(this.animEl).state;

    if (state === 1) {
      this.start();
    }
  }

  runState = false;

  start() {
    if (this.runState) {
      return;
    }
    this.runState = true;
    const { width } = this.animEl.getClientRect();
    const scale = this.stage.scaleX();

    this.movejl = width / scale - 30;

    this.tim = setInterval(() => {
      this.anim();
    }, 300);
  }
  stop() {
    this.runState = false;
    clearInterval(this.tim);
  }
  destroy() {
    this.stop();
    this.animGroup.remove();
  }
  anim() {
    const node = this.cacheCoal.clone();
    this.animGroup.add(node);
    const { width } = this.animEl.getClientRect();
    const scale = this.stage.scaleX();
    node.setAttrs({
      width: 30,
      height: 14,
    });
    node.setAttrs({
      y: 25 - node.height(),
    });
    const movejl = width / scale - node.width();
    const tween = new Konva.Tween({
      node,
      // rotation: 360,
      duration: width / node.width() / scale / 3,
      x: movejl,
    });
    tween.play();
    tween.onFinish = () => {
      const hidek = new Konva.Tween({
        node,
        opacity: 0,
        x: movejl + 10,
        y: node.getAttr("y") + 3,
        duration: 0.2,
      });
      hidek.play();
      hidek.onFinish = () => {
        node.remove();
      };
    };
  }
}

export { COALANIM };
