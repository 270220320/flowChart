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
export const subLineTheme: Record<Theme, Konva.NodeConfig> = {
  light: {
    stroke: "rgb(0, 161, 255)",
    strokeWidth: 1,
    name: "guid-line",
    dash: [4, 6],
  },
  dark: {
    stroke: "rgb(0, 161, 255)",
    strokeWidth: 1,
    name: "guid-line",
    dash: [4, 6],
  },
};
