import Konva from "konva";
import layer from "src/util/layer";
import INLEDITOR from "..";

export default (inlEditor: INLEDITOR) => {
  const Rect = new Konva.Circle({
    x: 0,
    y: 0,
    fill: "red",
    radius: 2,
  });

  const layerBox = layer(inlEditor.getStage(), "test");
  layerBox.add(Rect);
};
