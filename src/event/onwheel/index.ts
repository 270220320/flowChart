import Konva from "konva";
import changeZoom from "./changeZoom";
import { resetNodeSize } from "./resetNodeSize";

export default (stage: Konva.Stage, cb?: () => void) => {
  stage.on("wheel", (e) => {
    e.evt.preventDefault();
    changeZoom(e.evt.deltaY, stage);
    resetNodeSize(stage);
    cb ? cb() : null;
  });
};
