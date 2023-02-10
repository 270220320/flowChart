import Konva from "konva";
import { Theme } from "./theme";

export const LineTheme: Record<Theme, Konva.NodeConfig> = {
  light: {
    pointerLength: 10,
    pointerWidth: 10,
    fill: "black",
    stroke: "black",
    strokeWidth: 4,
  },
  dark: {
    pointerLength: 10,
    pointerWidth: 10,
    fill: "grey",
    stroke: "grey",
    strokeWidth: 4,
  },
};
