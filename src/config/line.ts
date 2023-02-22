import Konva from "konva";
import { Theme } from "./theme";

export const LineTheme: Record<Theme, Konva.NodeConfig> = {
  light: {
    pointerLength: 10,
    pointerWidth: 10,
    fill: "green",
    stroke: "green",
    strokeWidth: 4,
  },
  dark: {
    pointerLength: 10,
    pointerWidth: 10,
    fill: "black",
    stroke: "black",
    strokeWidth: 4,
  },
};
export const lineState = {
  default: "CORRECT_MEDIUM",

  light: {
    RAW_COAL: "#EA5858",
    CLEAN_COAL: "#22CC83",
    REJECT: "#6554C0",
    SLURRY: "#A52337",
    DILUTE_MEDIUM: "#9095A2",
    MIDDLINGS: "#FF9214",
    SLIME: "#729918",
    CLARIFIED_WATER: "#1CDDEB",
    CORRECT_MEDIUM: "#354052",
    AIR: "#D439D4",
  },
  dark: {
    RAW_COAL: "#EA5858",
    CLEAN_COAL: "#22CC83",
    REJECT: "#6554C0",
    SLURRY: "#A52337",
    DILUTE_MEDIUM: "#9095A2",
    MIDDLINGS: "#FF9214",
    SLIME: "#729918",
    CLARIFIED_WATER: "#1CDDEB",
    CORRECT_MEDIUM: "#354052",
    AIR: "#D439D4",
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
