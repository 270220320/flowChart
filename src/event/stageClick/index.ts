import Konva from "konva";
import { Shape, ShapeConfig } from "konva/lib/Shape";
import { getCustomAttrs } from "@/util/customAttr";

export type onSelectCallBackFun = (
  type: "thing" | "shape" | "thingText" | "stage",
  e: Konva.Group | Konva.Rect | Shape<ShapeConfig> | Konva.Stage,
  data?: {
    iu?: string;
    code?: Array<string>;
    attrs?: Konva.NodeConfig;
  }
) => void;

export default (stage: Konva.Stage, cb: onSelectCallBackFun) => {
  stage.on("click", (e) => {
    if (e.target !== stage) {
      // 如果是图形或者是文字，那么父级别肯定是layer
      let parent = e.target.getParent() as Konva.Layer | Konva.Group;
      // 如果是父级不是layer那就有可能是thing或者是thingText

      if (parent.getClassName() === "Layer") {
        cb("shape", e.target, {
          attrs: e.target.getAttrs(),
        });
      } else {
        const name = parent.name();
        switch (name) {
          case "thingGroup":
            const data1 = getCustomAttrs(parent);
            const code1 = parent
              .find("Group")
              .map((item) => item.getAttr("code"));
            cb("thing", parent, { iu: data1.thing!.iu, code: code1 });
            break;
          default:
            const selfParent = e.target.getParent() as any;
            const thingData = getCustomAttrs(parent.getParent());
            const code2 = parent.getAttr("code");
            cb("thingText", selfParent, {
              iu: thingData.thing!.iu,
              code: [code2],
            });
        }
      }
    } else {
      cb("stage", e.target);
    }
  });
};
