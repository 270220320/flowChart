import Konva from "konva";
import INLEDITOR from "src";
import layer from "src/util/layer";
import { enterEditLine } from "src/util/line/editLine";

export default (ie: INLEDITOR) => {
  layer(ie.stage, "line").on("dblclick", (e) => {
    if (e.target.className === "Arrow") {
      enterEditLine(e.target as Konva.Arrow, ie);
    }
  });
};
