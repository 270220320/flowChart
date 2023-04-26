import Konva from "konva";
import pointConfig from "@/config/point";

type Anchor = {
  type: "in" | "out";
  point: {
    x: number;
    y: number;
  };
};
export const createAnchors = (stage, anchors: Anchor[]) => {
  return anchors.map((anchor: Anchor) => {
    return new Konva.Circle({
      x: anchor.point.x,
      y: anchor.point.y,
      name: anchor.type,
      radius: pointConfig.radius / stage.scaleX(),
      fill: "white",
      stroke: "lightskyblue",
      strokeWidth: 0.5,
    });
  });
};
