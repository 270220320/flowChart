import Konva from "konva";
import { Theme } from "./theme";

export const MapTitleTheme: Record<Theme, Konva.NodeConfig> = {
  light: {
    fillLinearGradientStartPoint: { x: 0, y: 0 },
    fillLinearGradientColorStops: [
      0,
      "#BCE7FF ",
      0.5,
      "#4DD8FF ",
      1,
      "#BCE7FF",
    ],
  },
  dark: {
    fillLinearGradientStartPoint: { x: 0, y: 0 },
    fillLinearGradientColorStops: [
      0,
      "#BCE7FF ",
      0.5,
      "#4DD8FF ",
      1,
      "#BCE7FF",
    ],
  },
};
