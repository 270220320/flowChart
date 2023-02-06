import INLEDITOR from "src";
import { Thing } from "src/data/thing";
import { createThingImageGroup } from "src/element/thing";
import { computedXYByEvent } from "src/util/computedXY";
import layer from "src/util/layer";
import { createElements } from "./animate";

export default (
  ie: INLEDITOR,
  dom: HTMLElement,
  callback?: (e: DragEvent) => void
) => {
  // createElements(ie);
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
    let thing = e.dataTransfer?.getData("thing");
    const useThing = thing ? (JSON.parse(thing) as Thing) : null;
    const { x, y } = computedXYByEvent(ie.stage, e);
    const layerThing = layer(ie.stage, "thing");
    // 上传thing
    if (useThing) createThingImageGroup(layerThing, useThing, x, y);
  };
};
