import Konva from "konva";
import INLEDITOR from "@/index";
import layer from "@/util/layer";
import { enterEditLine } from "@/util/line/editLine";

export default (ie: INLEDITOR) => {
  const stage = ie.getStage();
  layer(stage, "line").on("dblclick", (e) => {
    if (e.target.className === "Arrow") {
      ie.setDrawState("editLine");
      stage.setAttrs({ draggable: false });
      enterEditLine(e.target as Konva.Arrow, stage);
    }
  });
};
