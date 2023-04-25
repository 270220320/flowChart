import { getCustomAttrs } from "@/util/customAttr";
import { KonvaEventObject } from "konva/lib/Node";
import { onSelectCallBackFun } from "../";
import isThingGroup from "./thingGroup";
import thingImage from "./thingImage";

export default (cb: onSelectCallBackFun, e: KonvaEventObject<MouseEvent>) => {
  let parent = e.target.getParent();
  if (parent.getClassName() !== "Layer") {
    const name = parent.name();
    switch (name) {
      case "thingGroup":
        isThingGroup(cb, e);
        break;
      case "thingImage":
        thingImage(cb, e);
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
};
