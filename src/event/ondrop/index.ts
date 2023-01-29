import Konva from "konva";
import INLEDITOR from "src";
import { Thing } from "src/data/thing";
import { computedXYByEvent } from "src/util/computedXY";
import layer from "src/util/layer";
import addThing from "./addThing";

export default (
  ie: INLEDITOR,
  dom: HTMLElement,
  callback?: (e: DragEvent) => void
) => {
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
    // 上传thing
    if (useThing) addThing(ie, x, y, useThing);

    console.log(e.dataTransfer?.files);
  };
};
