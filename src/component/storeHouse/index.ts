import { Thing } from "@/data/thing";
import Konva from "konva";
import { ComponentFac } from "../componentFac";
import storeHouseEmpty from "../../assets/storeHouseEmpty.svg";
import storeHouseFull from "../../assets/storeHouseFull.svg";

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
      img.setAttrs({ src: storeHouseEmpty });
      com.imgGroup.add(img);
      img.moveDown();
    };
    imageObj.src = storeHouseEmpty;
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
      img.setAttrs({ src: storeHouseFull });
      clipGroup.add(img);
      com.imgGroup.add(clipGroup);
      clipGroup.moveUp();
    };
    imageFull.src = storeHouseFull;
    return com.thingGroup;
  }
  setLevel = (iu: string, percent: number) => {
    const thingGroup = this.stage.findOne("#" + iu);
    const imgGroup = thingGroup.children.find(
      (ele) => ele.attrs.name === "thingImage"
    );
    const clip = imgGroup.children.find((ele) => ele.attrs.name === "clip");
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
