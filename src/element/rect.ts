import Konva from "konva";
import { RectConfig } from "konva/lib/shapes/Rect";
import { setCustomAttrs } from "@/util/customAttr";
import { UUID } from "@/util/uuid";
import theme, { Theme } from "../config/theme";

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
