import { Thing } from "../../data/thing";
import { createComponentThingGoup } from "@/element";
import { getCustomAttrs, setCustomAttrs } from "@/util/customAttr";
import layer from "../../util/layer";
import Konva from "konva";
import state from "./state";
import { getTran } from "@/event/selectItem";
import { UUID } from "@/util/uuid";

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

class BELT {
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
  name = "belt";

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
    width: 180,
    height: 25,
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
        this.group.off("transform");

        const { width, x, y } = getTran(this.stage).position!;
        this.config.left = x;
        this.config.top = y;
        this.config.width = (width * this.group.scaleX()) / this.stage.scaleX();
        this.group.scale({
          x: 1,
          y: 1,
        });
        this.config.theme = getCustomAttrs(this.group).state || 0;
        this.group.removeChildren();
        this.draw.render(this.config.theme);
      });
    },
    init: () => {
      this.draw.render(0);
      this.config.callBack(this.group);
    },
    render: (stateType: number | string) => {
      const theme = state[stateType || 0];
      // 最大的

      this.brect = new Konva.Rect({
        fillLinearGradientStartPoint: { x: 0, y: 0 },
        fillLinearGradientEndPoint: { x: 0, y: this.config.height },
        fillLinearGradientColorStops: [
          0,
          theme.rect1.bj[0],
          0.3,
          theme.rect1.bj[1],
          1,
          theme.rect1.bj[2],
        ],
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
        fillLinearGradientStartPoint: { x: 6, y: 6 },
        fillLinearGradientEndPoint: { x: 6, y: this.config.height - 6 },
        fillLinearGradientColorStops: [
          0,
          theme.rect3.bj[0],
          0.5,
          theme.rect3.bj[1],
          1,
          theme.rect3.bj[2],
        ],
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
      this.group.add(
        this.brect,
        this.brect1,
        this.brect2,
        this.circle,
        this.circle1
      );

      setCustomAttrs(this.group, { state: this.config.theme });
      this.thingGroup.add(this.group);
      this.draw.event();
    },
  };
}
export const changeBeltState = (
  stage: Konva.Stage,
  stateType: string | number,
  iu: string
) => {
  const thingLayer = layer(stage, "thing");
  const thingGroup = thingLayer.findOne(`#${iu}`) as Konva.Group;
  const thingImage = thingGroup.findOne(`.thingImage`) as Konva.Group;
  const block = thingImage.findOne(".block");
  const thingIrect = block.getAttrs();
  const width = thingIrect.width;
  const height = thingIrect.height;
  const theme = state[stateType];
  thingImage.removeChildren();
  const brect = new Konva.Rect({
    fillLinearGradientStartPoint: { x: 0, y: 0 },
    fillLinearGradientEndPoint: { x: 0, y: height },
    fillLinearGradientColorStops: [
      0,
      theme.rect1.bj[0],
      0.3,
      theme.rect1.bj[1],
      1,
      theme.rect1.bj[2],
    ],
    width: width,
    height: height,
    cornerRadius: [13, 13, 26, 26],
    stroke: "black",
    name: "block",
    strokeWidth: 0.5,
  });

  const brect1 = new Konva.Rect({
    x: 3,
    y: 3,
    fill: theme.rect2.bj[0],
    width: width - 6,
    height: height - 6,
    cornerRadius: [10, 10, 20, 20],
    stroke: "black",
    strokeWidth: 0.5,
    draggable: false,
  });

  const brect2 = new Konva.Rect({
    x: 6,
    y: 6,
    fillLinearGradientStartPoint: { x: 6, y: 6 },
    fillLinearGradientEndPoint: { x: 6, y: height - 6 },
    fillLinearGradientColorStops: [
      0,
      theme.rect3.bj[0],
      0.5,
      theme.rect3.bj[1],
      1,
      theme.rect3.bj[2],
    ],
    draggable: false,
    width: width - 12,
    height: height - 12,
    cornerRadius: [6, 6, 13, 13],
    stroke: theme.rect3.border,
    strokeWidth: 1,
  });

  const circle = new Konva.Circle({
    x: 13,
    y: 12.5,
    radius: 5,
    fill: theme.round.bj[0],
    draggable: false,
  });
  const circle1 = new Konva.Circle({
    x: width - 13,
    y: 12.5,
    radius: 5,
    fill: theme.round.bj[0],
    draggable: false,
  });
  setCustomAttrs(thingImage, { state: stateType });
  thingImage.add(brect, brect1, brect2, circle, circle1);
  return thingImage;
};
export { BELT };

export default BELT;
