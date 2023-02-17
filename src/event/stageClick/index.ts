import Konva from "konva";
import { Shape, ShapeConfig } from "konva/lib/Shape";
import { getCustomAttrs } from "@/util/customAttr";

export type onSelectCallBackFun = (
  type: "thing" | "shape" | "thingText" | "stage" | string,
  e: {
    target: Konva.Group | Konva.Rect | Shape<ShapeConfig> | Konva.Stage;
    parent?: Konva.Group | Konva.Rect | Shape<ShapeConfig> | Konva.Stage;
  },
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
      if (!parent) return;
      if (parent.getClassName() === "Layer") {
        cb(
          e.target.getClassName(),
          {
            target: e.target,
            parent,
          },
          {
            attrs: e.target.getAttrs(),
          }
        );
      } else {
        const name = parent.name();
        switch (name) {
          case "thingGroup":
            const data1 = getCustomAttrs(parent);
            const code1 = parent
              .find("Group")
              .map((item) => item.getAttr("code"));
            cb(
              "thing",
              { parent, target: e.target },
              { iu: data1.thing!.iu, code: code1 }
            );
            break;
          case "thingImage":
            const thingImgParent =
              e.target.getClassName() === "Image" ? parent : parent.getParent();
            const thingImgData = getCustomAttrs(thingImgParent);

            cb(
              "thing",
              { parent: thingImgParent as any, target: parent },
              { iu: thingImgData.thing!.iu, code: ["CODE"] }
            );
            break;
          default:
            const selfParent = e.target.getParent() as any;
            const thingData = getCustomAttrs(parent.getParent());
            const code2 = parent.getAttr("code");
            cb(
              "thingText",
              { parent: selfParent, target: e.target },
              {
                iu: thingData.thing!.iu,
                code: [code2],
              }
            );
        }
      }
    } else {
      cb("stage", { target: e.target });
    }
  });
};
