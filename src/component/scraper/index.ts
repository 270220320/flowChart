import { Thing } from "../../data/thing";
import { createComponentThingGoup } from "@/element";
import { getCustomAttrs, setCustomAttrs } from "@/util/customAttr";
import layer from "../../util/layer";
import Konva from "konva";
import state from "./state";
import { getTran } from "@/event/selectItem";
import { UUID } from "@/util/uuid";
import scraperLeft from "../../assets/scraperLeft.svg";
import scraperRight from "../../assets/scraperRight.svg";

interface Scraper {
  stage: Konva.Stage;
  group: Konva.Group;
  thingGroup: Konva.Group;
  rect: Konva.Rect;
}

class Scraper {
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
  name = "scraper";

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
    width: 192,
    height: 26,
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
        const middle = this.group.children.find(
          (ele) => ele.name() === "middle"
        );
        middle.setAttrs({ width: this.config.width - 31 - 42 });
        const right = this.group.children.find((ele) => ele.name() === "right");
        right.setAttrs({ x: this.config.width - 42 });
      });
    },
    init: () => {
      this.draw.render(0);
      this.config.callBack(this.group);
    },
    render: async (stateType: number | string) => {
      const theme = state[stateType || 0];
      // 左
      let imageObj = new Image();
      imageObj.onload = () => {
        const img = new Konva.Image({
          x: 0,
          y: 0,
          image: imageObj,
          width: 31,
          height: 26,
          name: "left",
        });
        img.setAttrs({ src: scraperLeft });
        this.group.add(img);
      };
      imageObj.src = scraperLeft;
      // 右
      let imageObj2 = new Image();
      imageObj2.onload = () => {
        const img = new Konva.Image({
          x: this.config.width - 42,
          y: 0,
          image: imageObj2,
          width: 42,
          height: 26,
          name: "right",
        });
        img.setAttrs({ src: scraperRight });
        this.group.add(img);
      };
      imageObj2.src = scraperRight;
      // 中间
      this.rect = new Konva.Rect({
        name: "middle",
        x: 31,
        y: 0 + 2,
        fill: "#D4D9DF",
        width: this.config.width - 31 - 42,
        height: 20,
        stroke: "black",
        strokeWidth: 0.5,
        draggable: false,
      });
      this.group.add(this.rect);
      setCustomAttrs(this.thingGroup, { state: this.config.theme });
      this.thingGroup.add(this.group);
      this.draw.event();
    },
  };
}
export { Scraper };

export default Scraper;
