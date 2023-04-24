import { Thing } from "@/data/thing";
import { createComponentThingGoup, createImage } from "@/element";
import { getCustomAttrs } from "@/util";
import layer from "@/util/layer";
import { UUID } from "@/util/uuid";
import { playOneWebRtcMt } from "@/videoPlay/videoV2";
import Konva from "konva";
import { ComponentFac } from "../componentFac";
interface VideoEle {
  thingGroup?: Konva.Group;
  imgGroup?: Konva.Group;
}
interface VideoNode {}
class VideoNode extends ComponentFac {
  name = "VideoNode";
  width = 150;
  height = 130;
  elements = [];
  add = async (
    thingInfo: Thing,
    p?: { x: number; y: number },
    isPreview?: boolean,
    eleGroup?: Konva.Group
  ) => {
    // 拖入
    if (p) {
      await this.draw(thingInfo, thingInfo.img, p);
      // 反序列化
    } else if (eleGroup && !isPreview) {
      const info = getCustomAttrs(eleGroup);
      const imgGroup: Konva.Group = eleGroup.children.find(
        (ele) => ele.attrs.name === "thingImage"
      ) as Konva.Group;
      const img = imgGroup.children[0];
      const imageObj = new Image();
      imageObj.src = info.thing.img;
      img?.setAttrs({ image: imageObj });
    } else {
      const video = document.createElement("video");
      video.id = thingInfo.iu;
      video.muted = true;
      video.autoplay = true;
      video.style.position = "fixed";
      video.width = 0;
      video.height = 0;
      document.getElementById("app").appendChild(video);
      playOneWebRtcMt(video.id, video.id);
      const thingGroup = this.stage.findOne("#" + thingInfo.iu);
      const imgGroup = thingGroup.children.find(
        (ele) => ele.attrs.name === "thingImage"
      );
      imgGroup.children[0].setAttrs({
        image: video,
        width: this.width,
        height: this.height,
      });
      const ani = new Konva.Animation(() => {
        // do nothing, animation just need to update the layer
      }, eleGroup.parent);
      ani.start();
      this.elements.push(video.id);
    }
  };
  destory = () => {
    this.elements.forEach((uuid: string) => {
      document.getElementById(uuid).remove();
    });
  };
  draw = async (
    thingInfo: Thing,
    imgUrl: string,
    p: { x: number; y: number }
  ) => {
    const element = this.product(
      p,
      { width: this.width, height: this.height },
      thingInfo
    );
    const image = await createImage(imgUrl);
    image.setAttrs({
      x: 0,
      y: 0,
      width: this.width,
      height: this.height,
    });
    element.imgGroup.add(image);
  };
}

export { VideoNode };
