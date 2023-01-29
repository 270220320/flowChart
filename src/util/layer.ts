import Konva from "konva";
import INLEDITOR from "..";

enum LAYER {
  test,
  thing,
  line,
}

export default (inl: INLEDITOR, type: keyof typeof LAYER) => {
  const layer = inl.stage.find(`.${type}`)[0] as Konva.Layer;
  const Rect = new Konva.Rect({
    x: 20,
    y: 20,
    width: 100,
    height: 50,
    fill: "green",
    stroke: "black",
  });

  if (layer) return layer;
  const layer1 = new Konva.Layer({
    name: type,
  });
  inl.stage.add(layer1);
  return layer1;
};
