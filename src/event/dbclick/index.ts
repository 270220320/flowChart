import Konva from "konva";
import INLEDITOR from "@/index";
import layer from "@/util/layer";
import { enterEditLine } from "@/util/line/editLine";
import { clearTransFormer } from "../selectItem";
import { editorText } from "@/element/text";

export default (ie: INLEDITOR) => {
  const stage = ie.getStage();
  layer(stage, "line").on("dblclick", (e) => {
    if (e.target.className === "Arrow" || e.target.className === "Line") {
      ie.setDrawState("editLine");
      stage.setAttrs({ draggable: false });
      const editLine = e.target.parent.findOne(".line");
      enterEditLine(editLine as Konva.Arrow, stage);
    }
  });

  // thing 内部双击事件
  layer(stage, "thing").on("dblclick", (e) => {
    const className = e.target.getClassName();
    if (className === "Text") {
      const { editable } = e.target.getAttrs();
      if (editable) {
        // 清除select
        clearTransFormer(ie.getStage());
        editorText(e.target as Konva.Text, stage);
      }
    }
  });
};
