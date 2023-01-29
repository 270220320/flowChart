import Konva from "konva";
import layer from "src/util/layer";
import INLEDITOR from "..";

export default (inlEditor: INLEDITOR) => {
  const Rect = new Konva.Rect({
    x: 20,
    y: 20,
    width: 100,
    height: 50,
    fill: "green",
    stroke: "black",
  });
  const layerBox = layer(inlEditor, "test");
  layerBox.add(Rect);
};
