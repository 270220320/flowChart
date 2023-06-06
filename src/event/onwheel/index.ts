import Konva from "konva";
import changeZoom from "./changeZoom";
import { resetNodeSize } from "./resetNodeSize";
import INLEDITOR from "@/index";

export default (ie: INLEDITOR, cb?: () => void) => {
  ie.getStage().on("wheel", (e) => {
    e.evt.preventDefault();
    if (ie.opt.isPreview) {
      return;
    }
    changeZoom(e.evt.deltaY, ie.getStage());
    resetNodeSize(ie.getStage());
    cb ? cb() : null;
  });
};
