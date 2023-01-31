import Konva from "konva";
import { LineConfig } from "konva/lib/shapes/Line";
import theme, { defaultTheme, Theme } from "./theme";

export const createSubLine = (conf: LineConfig, themeType?: Theme) => {
  const { subLine } = theme[themeType || defaultTheme];
  return new Konva.Line({
    ...conf,
    stroke: subLine.stroke,
    strokeWidth: subLine.strokeWidth,
    name: subLine.name,
    dash: subLine.dash,
  });
};
