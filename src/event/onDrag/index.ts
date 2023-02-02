import INLEDITOR from "src";
import { closeSubLine, initSubLine } from "./subline";
import { dealRelation } from "../../util/element/relation";

export default function (this: INLEDITOR) {
  const { stage } = this;
  // 按下移动
  stage.on("dragmove", (e) => {
    // 启动辅助线
    initSubLine.bind(this)(stage, e);
    // 线随动
    dealRelation(e, stage);
  });
  // 结束拖动
  stage.on("dragend", () => {
    // 关闭辅助线
    closeSubLine.bind(this)();
  });
}
