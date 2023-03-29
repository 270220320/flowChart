import { Thing } from "@/data/thing";
import { createComponentThingGoup } from "@/element";
import layer from "@/util/layer";
import { getUsePointUn } from "@/util/line/line";
import { UUID } from "@/util/uuid";
import Konva from "konva";
import { Component } from "../component";
import storeHouseEmpty from "../../assets/storeHouseEmpty.svg";
import storeHouseFull from "../../assets/storeHouseFull.svg";

interface StoreHouseEle {
  thingGroup?: Konva.Group;
  imgGroup?: Konva.Group;
}
interface StoreHouse {
  setLevel: (id: string, percent: number) => void;
}
class StoreHouse extends Component {
  stage;
  constructor(stage: Konva.Stage) {
    super();
    this.stage = stage;
  }
  name = "storeHouse";
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
    const storeHouseEle: StoreHouseEle = {};
    const lay = layer(this.stage, "thing");
    storeHouseEle.imgGroup = new Konva.Group({
      ...p,
      draggable: false,
      width,
      height,
      name: "thingImage",
      componentName: this.name,
      id: UUID(),
    });
    storeHouseEle.thingGroup = createComponentThingGoup(
      lay,
      thingInfo,
      storeHouseEle.imgGroup
    );
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
      storeHouseEle.imgGroup.add(img);
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
      storeHouseEle.imgGroup.add(clipGroup);
      clipGroup.moveUp();
    };
    imageFull.src = storeHouseFull;
    return storeHouseEle.thingGroup;
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
const points = [
  {
    x: 0,
    y: 0,
  },
  {
    x: 50,
    y: 0,
  },
  {
    x: 50,
    y: 50,
  },
  {
    x: 0,
    y: 50,
  },
];
export { StoreHouse };
