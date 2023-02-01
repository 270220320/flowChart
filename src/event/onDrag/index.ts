import INLEDITOR from "src";
import layer from "src/util/layer";
import { closeSubLine, initSubLine } from "./subline";

export default function (this: INLEDITOR) {
  const { stage } = this;
  const layerSubLine = layer(this, "util");
  // 按下移动
  stage.on("dragmove", (e) => {
    // 启动辅助线
    initSubLine.bind(this)(stage, layerSubLine, e);
  });
  // 结束拖动
  stage.on("dragend", () => {
    // 关闭辅助线
    closeSubLine.bind(this)(layerSubLine);
  });
}
