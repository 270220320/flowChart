import Konva from "konva";
import { Theme } from "./theme";

export const RectTheme: Record<Theme, Konva.NodeConfig> = {
  light: {
    fill: "#D8D8D8",
    stroke: "#D8D8D8",
    strokeWidth: 1,
    draggable: true,
    strokeScaleEnabled: false,
  },
  dark: {
    fill: "#D8D8D8",
    stroke: "#D8D8D8",
    strokeWidth: 1,
    draggable: true,
    strokeScaleEnabled: false,
  },
};
