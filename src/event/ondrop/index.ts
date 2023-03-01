import INLEDITOR from "@/index";
import dropThingImage from "./dropThingImage";
import customAddImage from "./customAddImage";
import computedXY from "@/util/computedXY";

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
    // 自定义组件拦截+回调
    const isCustomComponent = e.dataTransfer?.getData("customComponent");
    const data = e.dataTransfer?.getData("thing");
    if (isCustomComponent) {
      const { x, y } = computedXY(ie.getStage(), e.offsetX, e.offsetY);
      ie.opt.onDropCb
        ? ie.opt.onDropCb(JSON.parse(data).thing, { x, y })
        : null;
      return;
    }
    if (e.dataTransfer.files.length > 0 && !data) {
      customAddImage(stage, e);
    } else {
      dropThingImage(stage, ie.getTheme(), e, ie.opt.onDropCb);
    }

    callback ? callback(e) : null;
  };
};
