import Konva from "konva";
import INLEDITOR from "@/index";
import layer from "@/util/layer";
import { enterEditLine } from "@/util/line/editLine";

export default (ie: INLEDITOR) => {
  layer(ie.stage, "line").on("dblclick", (e) => {
    if (e.target.className === "Arrow") {
      ie.drawState = "editLine";
      ie.stage.setAttrs({ draggable: false });
      enterEditLine(e.target as Konva.Arrow, ie);
    }
  });
};
