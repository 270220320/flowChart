import Konva from "konva";
import { Shape, ShapeConfig } from "konva/lib/Shape";
import selectStage from "./selectStage";
import shapeText from "./shapeText";
import selectThing from "./selectThing";

export type onSelectCallBackFun = (
  type: "thing" | "shape" | "thingText" | "stage" | string,
  e: {
    target: Konva.Group | Konva.Rect | Shape<ShapeConfig> | Konva.Stage;
    parent?: Konva.Group | Konva.Rect | Shape<ShapeConfig> | Konva.Stage;
  },
  data?: {
    iu?: string;
    codes?: Array<string>;
    ids?: Array<string>;
    attrs?: Konva.NodeConfig;
  }
) => void;

export const getIus = (group: Konva.Group) => {
  let arr = [];
  try {
    arr = group
      .find("Group")
      .map((item) => item.getAttr("code"))
      .filter((item) => item);
  } catch (error) {
    new Error("获取iu失败");
  }
  return arr;
};

export default (stage: Konva.Stage, cb: onSelectCallBackFun) => {
  stage.on("click tap", (e) => {
    if (e.target !== stage) {
      // 如果是图形或者是文字，那么父级别肯定是layer
      let parent = e.target.getParent() as Konva.Layer | Konva.Group;
      // 如果是父级不是layer那就有可能是thing或者是thingText
      if (!parent) return;

      shapeText(cb, e);
      selectThing(cb, e);
    } else {
      selectStage(cb, e);
    }
  });
};
