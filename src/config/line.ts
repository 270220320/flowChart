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
export const lineState = {
  default: "CORRECT_MEDIUM",
  light: {
    RAW_COAL: "#FAD3D3",
    CLEAN_COAL: "#B2EDD4",
    REJECT: "#DCD7F4",
    SLURRY: "#EACDD2",
    DILUTE_MEDIUM: "#E3E7F0",
    MIDDLINGS: "#FFE2C1",
    SLIME: "#CCDEA3",
    CLARIFIED_WATER: "#BEEFF3",
    CORRECT_MEDIUM: "#CCD5E4",
    AIR: "#F1C9F1",
  },
  dark: {
    RAW_COAL: "#4B2943",
    CLEAN_COAL: "#144C50",
    REJECT: "#232863",
    SLURRY: "#371A3A",
    DILUTE_MEDIUM: "#495471",
    MIDDLINGS: "#523B2E",
    SLIME: "#273D30",
    CLARIFIED_WATER: "#175070",
    CORRECT_MEDIUM: "#212F51",
    AIR: "#452069",
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
