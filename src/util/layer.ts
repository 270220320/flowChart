import Konva from "konva";
import INLEDITOR from "..";

enum LAYER {
  test,
  thing, // text、thing、 shape
  line,
  util,
}

export default (inl: INLEDITOR, type: keyof typeof LAYER) => {
  let layer = inl.stage.find(`.${type}`)[0] as Konva.Layer;
  if (!layer) {
    layer = new Konva.Layer({
      name: type,
    });
    inl.stage.add(layer);
  }
  return layer;
};
