import { BELT } from "@/component";
import { getCustomAttrs } from "@/util/customAttr";
import layer from "@/util/layer";
import Konva from "konva";

export default (stage: Konva.Stage) => {
  const thingLayer = layer(stage, "thing");
  thingLayer.find(".thingImage").forEach((item) => {
    const { componentName } = item.getAttrs();
    if (componentName && componentName === "belt") {
      const { thing } = getCustomAttrs(item.parent);
      new BELT(stage, { thingInfo: thing });
    }
  });
};
