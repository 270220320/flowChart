import Konva from "konva";
import { RectConfig } from "konva/lib/shapes/Rect";
import { setCustomAttrs } from "src/util/customAttr";
import theme, { Theme } from "../config/theme";
import { UUID } from "src/util/uuid";
import layer from "src/util/layer";

export const createSelectionBox = (stage: Konva.Stage, themeType?: Theme) => {
  const layer = stage.findOne(`.selection`);
  if (layer) return layer;
  const t = theme[themeType || "light"];
  const rect1 = defaultRect({
    name: "selection",
    strokeWidth: 1,
    strokeScaleEnabled: false,
    ...t.selection,
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

export const defaultRect = (position: RectConfig, themeType?: Theme) => {
  const t = theme[themeType || "light"];
  const rect = new Konva.Rect({
    id: UUID(),
    ...t.rect,
    ...position,
  });
  setCustomAttrs(rect, {
    lineInfo: {
      outLineIds: [],
      inLineIds: [],
    },
  });
  return rect;
};

export const createBackgroundRect = (stage: Konva.Stage, themeType: Theme) => {
  const utilLayer = layer(stage, "util");
  const rect = new Konva.Rect({
    id: "backgroundRect",
    fill: theme[themeType].background,
    width: stage.width(),
    height: stage.height(),
  });
  utilLayer.add(rect);
  utilLayer.draw();
  return rect;
};
export const getBackgroundRect = (stage: Konva.Stage) => {
  const rect = layer(stage, "util").findOne("#backgroundRect");
  return rect;
};
