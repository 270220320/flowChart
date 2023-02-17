import { Thing } from "../../data/thing";
import { createThingGroup } from "@/element";
import { getCustomAttrs, setCustomAttrs } from "@/util/customAttr";
import layer from "../../util/layer";
import Konva from "konva";
import { Component } from "../component";
import state from "./state";
import { getTran } from "@/event/selectItem";

interface BELT {
  stage: Konva.Stage;
  group: Konva.Group;
  thingGroup: Konva.Group;
  brect: Konva.Rect;
  brect1: Konva.Rect;
  brect2: Konva.Rect;
  circle: Konva.Circle;
  circle1: Konva.Circle;
}

class BELT extends Component {
  constructor() {
    super();
  }
  name = "belt";
  init() {
    this.stage = this.stage || this.editor.getStage();
  }
  createThingGroup(thingInfo: Thing) {
    this.thingGroup = createThingGroup(thingInfo);
    this.draw.init();
  }
  config = {
    width: 180,
    height: 25,
    left: 0,
    top: 0,
    theme: 2,
    callBack: (group: Konva.Group) => {},
  };
  render(group: Konva.Group, theme: number = 0) {
    const { beltGroupType } = getCustomAttrs(group);
    this.config.theme = beltGroupType;
    this.draw.update();
  }
  draw = {
    event: () => {
      this.group.on("transform", (e) => {
        this.group.off("transform");
        const { width, x, y } = getTran(this.stage).position!;
        this.config.left = x;
        this.config.top = y;
        this.config.width = (width * this.group.scaleX()) / this.stage.scaleX();
        this.group.scale({
          x: 1,
          y: 1,
        });
        this.group.removeChildren();
        this.draw.update();
      });
    },
    init: () => {
      this.draw.render(state[this.config.theme]);
      this.config.callBack(this.group);
    },
    update: () => {
      //   this.config.width = this.config.width * this.group.scaleX();

      this.draw.render(state[this.config.theme]);
      this.stage.draw();
    },
    zz: () => {
      this.group.add(
        this.brect,
        this.brect1,
        this.brect2,
        this.circle,
        this.circle1
      );
    },
    render: (theme: typeof state[0]) => {
      // 最大的
      this.brect = new Konva.Rect({
        // fillLinearGradientStartPoint: { x: -50, y: -50 },
        // fillLinearGradientEndPoint: { x: 50, y: 50 },
        // fillLinearGradientColorStops: [
        //   0,
        //   theme.rect1.bj[0],
        //   1,
        //   theme.rect1.bj[1],
        //   2,
        //   theme.rect1.bj[2],
        // ],
        fill: "#fff",
        width: this.config.width,
        height: this.config.height,
        cornerRadius: [13, 13, 26, 26],
        stroke: "black",
        name: "block",
        strokeWidth: 0.5,
      });

      this.brect1 = new Konva.Rect({
        x: 3,
        y: 3,
        fill: theme.rect2.bj[0],
        width: this.config.width - 6,
        height: this.config.height - 6,
        cornerRadius: [10, 10, 20, 20],
        stroke: "black",
        strokeWidth: 0.5,
        draggable: false,
      });

      this.brect2 = new Konva.Rect({
        x: 6,
        y: 6,
        fill: "#fff",
        // fillLinearGradientStartPoint: { x: -50, y: -50 },
        // fillLinearGradientEndPoint: { x: 50, y: 50 },
        // fillLinearGradientColorStops: [
        //   0,
        //   theme.rect3.bj[0],
        //   1,
        //   theme.rect3.bj[1],
        //   2,
        //   theme.rect3.bj[2],
        // ],
        draggable: false,
        width: this.config.width - 12,
        height: this.config.height - 12,
        cornerRadius: [6, 6, 13, 13],
        stroke: theme.rect3.border,
        strokeWidth: 1,
      });

      this.circle = new Konva.Circle({
        x: 13,
        y: 12.5,
        radius: 5,
        fill: theme.round.bj[0],
        draggable: false,
      });
      this.circle1 = new Konva.Circle({
        x: this.config.width - 13,
        y: 12.5,
        radius: 5,
        fill: theme.round.bj[0],
        draggable: false,
      });

      if (!this.group) {
        this.group = new Konva.Group({
          width: this.config.width,
          height: this.config.height,
          x: this.config.left || 0,
          y: this.config.top || 0,
          draggable: false,
          name: "thingImage",
        });
      }

      this.group.add(
        this.brect,
        this.brect1,
        this.brect2,
        this.circle,
        this.circle1
      );

      const thingLayer = layer(this.stage, "thing");
      setCustomAttrs(this.group, { beltGroupType: this.config.theme });
      this.thingGroup.add(this.group);
      thingLayer.add(this.thingGroup);
      this.draw.event();
    },
  };
}

export default BELT;
