import Konva from "konva";
import { Theme } from "./theme";

export const RectTheme: Record<Theme, Konva.NodeConfig> = {
  light: {
    fill: "#D8D8D8",
    stroke: "#979797",
    strokeWidth: 1,
    draggable: true,
    strokeScaleEnabled: false,
  },
  dark: {
    fill: "#2A6BDB",
    stroke: "#979797",
    strokeWidth: 1,
    draggable: true,
    strokeScaleEnabled: false,
  },
};
