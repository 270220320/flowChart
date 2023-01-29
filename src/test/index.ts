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
    draggable: true,
  });
  var arrow = new Konva.Arrow({
    x: 4,
    y: 4,
    points: [0, 0, 200, 0, 150, 300],
    pointerLength: 20,
    pointerWidth: 20,
    fill: "black",
    stroke: "black",
    strokeWidth: 4,
    data: {},
  });

  const layerBox = layer(inlEditor, "test");
  layerBox.add(Rect, arrow);
};
