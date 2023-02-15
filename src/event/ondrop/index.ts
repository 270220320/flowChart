import INLEDITOR from "@/index";
import { getTransferData } from "@/data/dropData";
import { createThingTextByGroup } from "@/element/text";
import { createThingImageGroup } from "@/element/thing";
import { computedXYByEvent } from "@/util/computedXY";
import layer from "@/util/layer";
import dropThingImage from "./dropThingImage";
import customAddImage from "./customAddImage";

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
    if (e.dataTransfer.files.length > 0 && !data) {
      customAddImage(stage, e);
    } else {
      dropThingImage(stage, ie.getTheme(), e);
    }

    callback ? callback(e) : null;
  };
};
