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
      case "clip":
      case "thingImage":
        thingImage(cb, e);
        break;
      default:
        const selfParent = e.target.getParent() as any;
        const thingData = getCustomAttrs(parent.getParent());
        const data = getCustomAttrs(parent);

        cb(
          "thingText",
          { parent: selfParent, target: e.target },
          {
            iu: thingData.thing!.iu,
            codes: [data?.propertyCode],
            ids: [data?.propertyId],
          }
        );
    }
  }
};
