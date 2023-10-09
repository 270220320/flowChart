import Konva from "konva";
import changeZoom from "./changeZoom";
import { resetNodeSize } from "./resetNodeSize";
import INLEDITOR from "@/index";

export default (ie: INLEDITOR, cb?: () => void) => {
  let timer = null;
  ie.getStage().on("wheel", (e) => {
    e.evt.preventDefault();
    if (ie.opt.isPreview) {
      return;
    }
    changeZoom(e.evt.deltaY, ie);
    resetNodeSize(ie.getStage());
    cb ? cb() : null;
    clearTimeout(timer);
    timer = setTimeout(() => {
      ie.saveHistory();
    }, 1000);
  });
};
