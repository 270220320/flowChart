import { Thing } from "@/data/thing";
import Konva from "konva";
import { ComponentFac } from "../componentFac";
import storeHouseEmpty from "../../assets/storeHouseEmpty.svg";
import storeHouseFull from "../../assets/storeHouseFull.svg";
import { UUID } from "@/util/uuid";

interface StoreHouse {
  setLevel: (id: string, percent: number) => void;
}
class StoreHouse extends ComponentFac {
  constructor(stage) {
    super(stage);
  }
  name = "StoreHouse";
  arr = [];
  add(thingInfo: Thing, p?: { x: number; y: number }, eleGroup?: Konva.Group) {
    // 拖入
    if (p) {
      this.arr.push(this.draw(thingInfo, p));
      // 反序列化
    } else if (eleGroup) {
      this.arr.push(eleGroup);
    }
  }
  refreshImg = (thingInfo, thingImage) => {
    thingImage.children.forEach((ele) => {
      ele.destroy();
    });
    // 裁剪
    const clipGroup = new Konva.Group({
      clip: {
        x: 0,
        y: 90,
        width: 90,
        height: 1,
        id: UUID(),
      },
      name: "clip",
    });

    // 图片
    let imageObj = new Image();
    imageObj.onload = () => {
      const img = new Konva.Image({
        x: 0,
        y: 0,
        image: imageObj,
        width: 90,
        height: 90,
        name: "empty",
      });
      img.setAttrs({ src: thingInfo.img });
      thingImage.add(img);
      img.moveDown();
    };
    imageObj.src = thingInfo.img;
    // 满图片
    let imageFull = new Image();
    imageFull.onload = () => {
      const img = new Konva.Image({
        x: 0,
        y: 0,
        image: imageFull,
        width: 90,
        height: 90,
        name: "full",
      });
      img.setAttrs({ src: thingInfo.fullImg });
      clipGroup.add(img);
      thingImage.children.find((ele) => ele.name() === "clip")?.destroy();
      thingImage.add(clipGroup);
      clipGroup.moveUp();
    };
    imageFull.src = thingInfo.fullImg;
  };
  draw(thingInfo: Thing, p: { x: number; y: number }) {
    const com = this.product(p, { width, height }, thingInfo);
    // 裁剪
    const clipGroup = new Konva.Group({
      clip: {
        x: 0,
        y: 90,
        width: 90,
        height: 1,
      },
      name: "clip",
    });

    // 图片
    let imageObj = new Image();
    imageObj.onload = () => {
      const img = new Konva.Image({
        x: 0,
        y: 0,
        image: imageObj,
        width: 90,
        height: 90,
        name: "left",
      });
      img.setAttrs({ src: thingInfo.img });
      com.imgGroup.add(img);
      img.moveDown();
    };
    imageObj.src = thingInfo.img;
    // 满图片
    let imageFull = new Image();
    imageFull.onload = () => {
      const img = new Konva.Image({
        x: 0,
        y: 0,
        image: imageFull,
        width: 90,
        height: 90,
        name: "left",
      });
      img.setAttrs({ src: thingInfo.fullImg });
      clipGroup.add(img);
      com.imgGroup.add(clipGroup);
      clipGroup.moveUp();
    };
    imageFull.src = thingInfo.fullImg;
    return com.thingGroup;
  }
  setLevel = (iu: string, percent: number) => {
    const thingGroup = this.stage.findOne("#" + iu);
    const imgGroup = thingGroup.children.find(
      (ele) => ele.attrs.name === "thingImage"
    );
    const clip = imgGroup.children.find((ele) => ele.attrs.name === "clip");
    clip.moveUp();
    const val = 90 * percent * 0.01 + 1;
    clip.setAttrs({
      clipY: 90 - val,
      clipHeight: val,
    });
  };
}

const width = 90;
const height = 90;
export { StoreHouse };
