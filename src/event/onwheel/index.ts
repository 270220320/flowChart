import Konva from "konva";
import changeZoom from "./changeZoom";

export default (stage: Konva.Stage, cb?: () => void) => {
  stage.on("wheel", (e) => {
    e.evt.preventDefault();
    changeZoom(e.evt.deltaY, stage);

    cb ? cb() : null;
  });
};
