import Konva from "konva";

type LayerTypes = "test" | "thing" | "line" | "util";

export const LAYER: Record<LayerTypes, LayerTypes> = {
  test: "test",
  thing: "thing", // text、thing、 shape
  line: "line",
  util: "util",
};

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
