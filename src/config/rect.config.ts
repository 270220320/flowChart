import Konva from "konva";

export const createSelectionBox = (stage: Konva.Stage) => {
  const layer = stage.findOne(`.selection`);
  if (layer) return layer;
  const rect1 = new Konva.Rect({
    name: "selection",
    fill: "transparent",
    stroke: "black",
    strokeWidth: 1,
  });
  const layer1 = new Konva.Layer({
    name: "selectionBox",
  });
  layer1.add(rect1);
  stage.add(layer1);
  return rect1;
};

export const removeSelectionBox = (stage: Konva.Stage) => {
  const layer = stage.findOne(`.selectionBox`);
  layer?.remove();
};

export const defaultRect = (position: {
  x: number;
  y: number;
  width: number;
  height: number;
}) => {
  return new Konva.Rect({
    ...position,
    fill: "#D8D8D8",
    stroke: "#979797",
    strokeWidth: 1,
    draggable: true,
  });
};
