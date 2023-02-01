import INLEDITOR from "src";
import { getScaleGroup } from "src/config/scale";
import layer from "src/util/layer";
import { closeSubLine, initSubLine } from "./subline";
import { dealRelation } from "../../util/element/relation";

export default function (this: INLEDITOR) {
  const { stage } = this;
  const layerSubLine = layer(this, "line");
  // 按下移动
  stage.on("dragmove", (e) => {
    // 处理scale
    const scale = getScaleGroup(this);
    scale.setAttrs({
      x: -stage.getAttrs().x,
      y: -stage.getAttrs().y,
    });
    // 启动辅助线
    initSubLine.bind(this)(stage, layerSubLine, e);
    // 线随动
    dealRelation(e, stage);
  });
  // 结束拖动
  stage.on("dragend", () => {
    // 关闭辅助线
    closeSubLine.bind(this)(layerSubLine);
  });
}
