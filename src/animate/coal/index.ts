import layer from "@/util/layer";
import Konva from "konva";
import drawCoal from "./drawCoal";

interface COALANIM {
  autoPlay: boolean;
  animEl: Konva.Node;
  stage: Konva.Stage;
  animGroup: Konva.Group;
  cacheCoal: Konva.Star;
  tim: number;
}
class COALANIM {
  constructor(stage: Konva.Stage, uuid: string, autoPlay?: boolean) {
    this.autoPlay = autoPlay || false;
    this.stage = stage;
    this.cacheCoal = drawCoal();
    this.cacheCoal.cache();
    this.reset(uuid);

    if (autoPlay) {
      this.start();
    }
  }
  reset(uuid: string) {
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
    this.start();
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
      y: 22,
    });
    const tween = new Konva.Tween({
      node,
      rotation: 360,
      duration: 5,
      x: width / scale - 10,
    });
    tween.play();
    tween.onFinish = () => {
      const { x } = node.getAttrs();
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
