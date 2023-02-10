import INLEDITOR from "@/index";
import { getTransferData } from "@/data/dropData";
import { createThingTextByGroup } from "@/element/text";
import { createThingImageGroup } from "@/element/thing";
import { computedXYByEvent } from "@/util/computedXY";
import layer from "@/util/layer";

export default (
  ie: INLEDITOR,
  dom: HTMLElement,
  callback?: (e: DragEvent) => void
) => {
  const stage = ie.getStage();
  dom.ondragenter = function (e) {
    e.preventDefault();
  };

  dom.ondragover = function (e) {
    e.preventDefault();
  };

  dom.ondragleave = function (e) {
    e.preventDefault();
  };

  dom.ondrop = (e) => {
    e.preventDefault();
    let data = e.dataTransfer?.getData("thing");
    const { thing, thingText } = getTransferData(data!);
    const { x, y } = computedXYByEvent(stage, e);
    const layerThing = layer(stage, "thing");
    const theme = ie.getTheme();
    // 上传thing
    if (thing) {
      // 创建thing group
      createThingImageGroup(layerThing, thing, x, y).then((group) => {
        if (thingText) createThingTextByGroup(group, thingText, theme);
      });
    }
    callback ? callback(e) : null;
  };
};
