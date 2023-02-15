import { Theme } from "@/config";
import { getTransferData } from "@/data/dropData";
import { createThingTextByGroup } from "@/element/text";
import { createThingImageGroup } from "@/element/thing";
import { computedXYByEvent } from "@/util/computedXY";
import layer from "@/util/layer";
import Konva from "konva";

export default (stage: Konva.Stage, themeType: Theme, e: DragEvent) => {
  let data = e.dataTransfer?.getData("thing");
  const { thing, thingText } = getTransferData(data!);
  const { x, y } = computedXYByEvent(stage, e);
  const layerThing = layer(stage, "thing");
  // 上传thing
  if (thing) {
    // 创建thing group
    createThingImageGroup(layerThing, thing, x, y).then((group) => {
      if (thingText) createThingTextByGroup(group, thingText, themeType);
    });
  }
};
