import INLEDITOR from "../..";
import { closeSubLine, initSubLine } from "./subline";
import { dealRelation } from "../../util/element/relation";
import { clearTransFormer } from "../selectItem";

export default (ie: INLEDITOR, cb?: () => void) => {
  const stage = ie.getStage();
  // 按下移动
  stage.on("dragmove", (e) => {
    // 启动辅助线
    initSubLine.bind(ie)(stage, e);

    // 块关联线随动
    dealRelation(e, ie.getStage());

    if (e.target !== stage) {
      clearTransFormer(stage);
    }

    cb ? cb() : null;
  });
  // 结束拖动
  stage.on("dragend", () => {
    // 关闭辅助线
    closeSubLine.bind(ie)();
  });
};
