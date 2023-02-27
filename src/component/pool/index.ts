import { Thing } from "@/data/thing";
import { createComponentThingGoup } from "@/element";
import layer from "@/util/layer";
import { getUsePointUn } from "@/util/line/line";
import { UUID } from "@/util/uuid";
import Konva from "konva";
import { Component } from "../component";
interface PoolEle {
  group?: Konva.Group;
  thingGroup?: Konva.Group;
}
interface Pool {
  setLevel: (id: string, percent: number) => void;
}
class Pool extends Component {
  stage;
  constructor(stage: Konva.Stage) {
    super();
    this.stage = stage;
  }
  name = "pool";
  pools = [];
  add(thingInfo: Thing, p: { x: number; y: number }) {
    const poolEle: PoolEle = {};
    const lay = layer(this.stage, "thing");
    poolEle.group = new Konva.Group({
      ...p,
      draggable: false,
      width,
      height,
      name: "thingImage",
      componentName: this.name,
      id: UUID(),
    });
    poolEle.thingGroup = createComponentThingGoup(
      lay,
      thingInfo,
      poolEle.group
    );
    const poly = new Konva.Line({
      id: UUID(),
      points: getUsePointUn(points),
      fill: "grey",
      stroke: "black",
      strokeWidth: 3,
      closed: true,
    });
    const rect = new Konva.Rect({
      id: UUID(),
      x: thickness,
      y: 0,
      name: "water",
      width: width - 2 * thickness,
      height: height - thickness,
      fill: "blue",
    });
    poolEle.group.add(rect);
    poolEle.group.add(poly);

    return poolEle.group.id();
  }
  setLevel = (id: string, percent: number) => {
    const thingGroup = this.stage.findOne("#" + id);
    const imgGroup = thingGroup.children.find(
      (ele) => ele.attrs.name === "thingImage"
    );
    const img = imgGroup.children.find((ele) => ele.attrs.name === "water");
    img.setAttrs({
      height: (height - thickness) * percent * 0.01,
      y: (height - thickness) * (1 - percent * 0.01),
    });
  };
}

const thickness = 20;
const width = 200;
const height = 150;
const points = [
  {
    x: 0,
    y: 0,
  },
  {
    x: thickness,
    y: 0,
  },

  {
    x: thickness,
    y: height - thickness,
  },
  {
    x: width - thickness,
    y: height - thickness,
  },
  {
    x: width - thickness,
    y: 0,
  },
  {
    x: width,
    y: 0,
  },
  {
    x: width,
    y: height,
  },
  {
    x: 0,
    y: height,
  },
];
export { Pool };
