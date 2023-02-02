import Konva from "konva";

enum LAYER {
  test,
  thing, // text、thing、 shape
  line,
  util,
}

export default (stage: Konva.Stage, type: keyof typeof LAYER) => {
  let layer = stage.find(`.${type}`)[0] as Konva.Layer;
  if (!layer) {
    layer = new Konva.Layer({
      name: type,
    });
    stage.add(layer);
  }
  return layer;
};
