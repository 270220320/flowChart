import { Thing } from "../../data/thing";
import { createComponentThingGoup } from "@/element";
import { getCustomAttrs, setCustomAttrs } from "@/util/customAttr";
import layer from "../../util/layer";
import Konva from "konva";
import { getTran } from "@/event/selectItem";
import { UUID } from "@/util/uuid";
import scraperLeft from "../../assets/scraperLeft.svg";
import scraperRight from "../../assets/scraperRight.svg";
import { createAnchors } from "@/util/anchor";

interface Technique {
  stage: Konva.Stage;
  group: Konva.Group;
  thingGroup: Konva.Group;
  rect: Konva.Rect;
}

class Technique {
  constructor(
    stage: Konva.Stage,
    info: {
      thingInfo: Thing;
      p?: { x: number; y: number };
    }
  ) {
    this.stage = stage;
    this.createThingGroup(info.thingInfo, info.p);
  }
  name = "Technique";

  createThingGroup(thingInfo: Thing, p?: { x: number; y: number }) {
    if (p) {
      this.config.left = p.x;
      this.config.top = p.y;
    }
    const thingLayer = layer(this.stage, "thing");
    const thingGroup = thingLayer.findOne(`#${thingInfo.iu}`);
    if (thingGroup) {
      this.thingGroup = thingGroup as Konva.Group;
      this.group = this.thingGroup.findOne(".thingImage");
      this.config.width =
        this.group.getClientRect().width / this.stage.scaleX();

      this.draw.event();
    } else {
      this.group = new Konva.Group({
        width: this.config.width,
        height: this.config.height,
        x: this.config.left || 0,
        y: this.config.top || 0,
        draggable: false,
        name: "thingImage",
        componentName: this.name,
        id: UUID(),
      });
      this.thingGroup = createComponentThingGoup(
        thingLayer,
        thingInfo,
        this.group
      );
      this.draw.init();
    }
  }
  config: any = {
    width: 80,
    height: 20,
    left: 0,
    top: 0,
    theme: 0,
    callBack: (group: Konva.Group) => {},
  };
  render(stateType: number) {
    this.config.theme = stateType;
    this.group.removeChildren();
    this.config.theme = getCustomAttrs(this.group).state || 0;
    this.draw.render(this.config.theme);
  }
  protected draw = {
    event: () => {
      this.group.on("transform", (e) => {
        const { width, x, y } = getTran(this.stage).position!;
        this.config.width = (width * this.group.scaleX()) / this.stage.scaleX();
        this.config.left = x;
        this.config.top = y;

        this.group.scale({
          x: 1,
          y: 1,
        });
        this.config.theme = getCustomAttrs(this.group).state || 0;
        this.group.children.forEach((ele) => {
          if (ele.name() === "middle") {
            ele.attrs.points[2] = this.config.width;
          }
          if (ele.name() === "right") {
            ele.setAttrs({ x: this.config.width });
          }
          if (ele.name() === "text") {
            ele.setAttrs({ x: this.config.width / 2 });
          }
        });
      });
    },
    init: () => {
      this.draw.render(0);
      this.config.callBack(this.group);
    },
    render: async (stateType: number | string) => {
      // 左
      const left = new Konva.Line({
        name: "left",
        points: [0, 0, 0, 20],
        stroke: "black",
        strokeWidth: 1,
      });
      // 右
      const right = new Konva.Line({
        name: "right",
        points: [0, 0, 0, 20],
        x: 80,
        stroke: "black",
        strokeWidth: 1,
      });
      // 中间
      const line1 = new Konva.Line({
        name: "middle",
        points: [0, 2, 80, 2],
        stroke: "black",
        strokeWidth: 4,
      });
      const line2 = new Konva.Line({
        name: "middle",
        points: [0, 6, 80, 6],
        stroke: "black",
        strokeWidth: 1,
      });
      const line3 = new Konva.Line({
        name: "middle",
        points: [0, 19.5, 80, 19.5],
        stroke: "black",
        strokeWidth: 1,
      });
      // 文字
      const text = new Konva.Text({
        name: "text",
        x: this.config.width / 2,
        y: 7,
        text: "",
        fontSize: 14,
        fill: "black",
      });
      this.group.add(text);
      text.offsetX(text.width() / 2);

      this.group.add(left);
      this.group.add(right);
      this.group.add(line1);
      this.group.add(line2);
      this.group.add(line3);

      createAnchors(this.stage, [
        { type: "out", point: { x: 0, y: 0 } },
        { type: "out", point: { x: this.config.width, y: 0 } },
        { type: "in", point: { x: this.config.width / 2, y: 0 } },
      ]).forEach((anchor) => {
        this.group.add(anchor);
      });
      setCustomAttrs(this.thingGroup, { state: this.config.theme });
      this.thingGroup.add(this.group);
      this.draw.event();
    },
  };
}
export const setText = (stage: Konva.Stage, text: string, iu: string) => {
  const thingLayer = layer(stage, "thing");
  const thingGroup = thingLayer.findOne(`#${iu}`) as Konva.Group;
  const thingImage = thingGroup.findOne(`.thingImage`) as Konva.Group;
  const textNode = thingImage.children.find((ele) => ele.name() === "text");
  textNode.setAttrs({ text });
  textNode.offsetX(textNode.width() / 2);
};

export { Technique };
