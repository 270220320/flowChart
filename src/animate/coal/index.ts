import { getCustomAttrs } from "@/main";
import layer from "@/util/layer";
import Konva from "konva";
import drawCoal from "./drawCoal";

interface COALANIM {
  autoPlay: boolean;
  animEl: Konva.Node;
  stage: Konva.Stage;
  animGroup: Konva.Group;
  cacheCoal: Konva.Star | Konva.Image;
  tim: number;
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

    this.reset(uuid, imgUrl);

    if (autoPlay) {
      this.start();
    }
  }
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
    const { x, y } = this.animEl.position();
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

  start() {
    this.tim = setInterval(() => {
      this.anim();
    }, 180);
  }
  stop() {
    clearInterval(this.tim);
  }
  destory() {
    this.stop();
    this.animGroup.remove();
  }
  anim() {
    const node = this.cacheCoal.clone();
    this.animGroup.add(node);
    const { width } = this.animEl.getClientRect();
    const scale = this.stage.scaleX();
    node.setAttrs({
      width: 15,
      height: 7,
    });
    node.setAttrs({
      y: 25 - node.height(),
    });
    const tween = new Konva.Tween({
      node,
      // rotation: 360,
      duration: width / node.width() / scale / 5,
      x: width / scale - node.width(),
    });
    tween.play();
    tween.onFinish = () => {
      const hidek = new Konva.Tween({
        node,
        opacity: 0,
        x: width / scale,
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
