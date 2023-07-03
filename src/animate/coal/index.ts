import { getCustomAttrs } from "@/main";
import computedXY from "@/util/computedXY";
import layer from "@/util/layer";
import Konva from "konva";
import drawCoal from "./drawCoal";

interface COALANIM {
  autoPlay: boolean; // 是否自动播放
  animEl: Konva.Node; // 动画元素
  stage: Konva.Stage; // 舞台
  animGroup: Konva.Group; // 动画组
  cacheCoal: Konva.Star | Konva.Image; // 缓存煤炭
  tim: any; // 定时器
  movejl: number; // 移动距离
  direction: "left" | "right"; // 煤炭移动方向
}

interface OPT {
  stage: Konva.Stage; // 舞台
  uuid: string; // 动画元素uuid
  imgUrl?: string; // 煤炭图片地址
  autoPlay?: boolean; // 是否自动播放
  direction?: "left" | "right"; // 煤炭移动方向
}
class COALANIM {
  constructor(opt: OPT) {
    const { autoPlay, stage, uuid, imgUrl, direction } = opt;
    this.autoPlay = autoPlay || false;
    this.stage = stage;
    this.direction = direction || "left";
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
    this.animGroup.children.forEach((node) => {
      node.remove();
    });
  }
  destroy() {
    this.stop();
    this.animGroup.remove();
  }
  anim() {
    const node = this.cacheCoal.clone() as Konva.Image;
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
      tween.destroy();
      if (this.runState) {
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
          hidek.destroy();
        };
      }
    };
  }
}

export { COALANIM };
