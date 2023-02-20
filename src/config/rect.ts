import Konva from "konva";
import { Theme } from "./theme";

export const RectTheme: Record<Theme, Konva.NodeConfig> = {
  light: {
    fill: "green",
    stroke: "green",
    strokeWidth: 1,
    draggable: true,
    strokeScaleEnabled: false,
  },
  dark: {
    fill: "orange",
    stroke: "orange",
    strokeWidth: 1,
    draggable: true,
    strokeScaleEnabled: false,
  },
};
