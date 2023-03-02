import { Thing } from "@/data/thing";
import { createComponentThingGoup } from "@/element";
import { getCustomAttrs } from "@/util";
import layer from "@/util/layer";
import { UUID } from "@/util/uuid";
import { playOneWebRtcMt } from "@/videoPlay/videoV2";
import Konva from "konva";
import { Component } from "../component";
interface VideoEle {
  thingGroup?: Konva.Group;
  imgGroup?: Konva.Group;
}
interface VideoNode {}
class VideoNode extends Component {
  stage;
  constructor(stage: Konva.Stage) {
    super();
    this.stage = stage;
  }
  name = "video";
  width = 200;
  height = 150;
  elements = [];
  add = (
    thingInfo: Thing,
    p?: { x: number; y: number },
    isPreview?: boolean,
    eleGroup?: Konva.Group
  ) => {
    // 拖入
    if (p) {
      this.draw(thingInfo, thingInfo.img, p);
      // 反序列化
    } else if (eleGroup && !isPreview) {
      const info = getCustomAttrs(eleGroup);
      const imgGroup: Konva.Group = eleGroup.children.find(
        (ele) => ele.attrs.name === "thingImage"
      ) as Konva.Group;
      const img = imgGroup.children[0];
      const imageObj = new Image();
      imageObj.src = info.thing.img;
      img.setAttrs({ image: imageObj });
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
      imgGroup.children[0].setAttrs({ image: video });
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
  draw = (thingInfo: Thing, imgUrl: string, p: { x: number; y: number }) => {
    const element: VideoEle = {};
    const lay = layer(this.stage, "thing");
    element.imgGroup = new Konva.Group({
      ...p,
      draggable: false,
      width: this.width,
      height: this.height,
      name: "thingImage",
      componentName: this.name,
      id: UUID(),
    });
    element.thingGroup = createComponentThingGoup(
      lay,
      thingInfo,
      element.imgGroup
    );
    const imageObj = new Image();
    imageObj.onload = function () {
      const video = new Konva.Image({
        x: 50,
        y: 50,
        image: imageObj,
        width: 106,
        height: 118,
      });

      // add the shape to the layer
      element.imgGroup.add(video);
    };
    imageObj.src = imgUrl;
  };
}

export { VideoNode };
