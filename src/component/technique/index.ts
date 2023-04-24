import { Thing } from "@/data/thing";
import { createComponentThingGoup } from "@/element";
import layer from "@/util/layer";
import { UUID } from "@/util/uuid";
import Konva from "konva";
import { ComponentFac } from "../componentFac";

interface Compon {
  thingGroup?: Konva.Group;
  imgGroup?: Konva.Group;
}
class Technique extends ComponentFac {
  name = "Technique";
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
  }
}

const width = 90;
const height = 90;
export { Technique };
