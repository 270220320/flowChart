import Konva from "konva";
import pointConfig from "@/config/point";
import layer from "../layer";

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
      stroke: anchor.type === "out" ? "lightskyblue" : "lightyellow",
      strokeWidth: 0.5,
    });
  });
};

export const judge = (stage, point, node) => {
  let ele: Konva.Node = layer(stage, "thing").getIntersection(point);
  if (ele.name() === "in") {
    return true;
  } else {
    return false;
  }
};
