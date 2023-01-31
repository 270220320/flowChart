import Konva from "konva";
import INLEDITOR from "..";

enum LAYER {
  test,
  thing,
  line,
  shape,
  text,
  subline,
  scale,
}

export default (inl: INLEDITOR, type: keyof typeof LAYER) => {
  const layer = inl.stage.find(`.${type}`)[0] as Konva.Layer;
  if (layer) return layer;
  const layer1 = new Konva.Layer({
    name: type,
  });
  inl.stage.add(layer1);
  return layer1;
};
