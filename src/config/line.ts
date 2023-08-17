import Konva from "konva";
import { Theme } from "./theme";

export const LineTheme: Record<Theme, Konva.NodeConfig> = {
  light: {
    pointerLength: 10,
    pointerWidth: 10,
    fill: "green",
    stroke: "green",
    strokeWidth: 4,
    borderOuter: "#DCE2ED",
    borderInner: "#F4F6F9",
  },
  dark: {
    pointerLength: 10,
    pointerWidth: 10,
    fill: "black",
    stroke: "black",
    strokeWidth: 4,
    borderOuter: "#7C87A1",
    borderInner: "#354468",
  },
};
export const lineState = {
  default: "CLEAN_COAL",

  light: {
    CLEAN_COAL: "#3FCC83",
  },
  dark: {
    CLEAN_COAL: "#3FCC83",
  },
};
export const gridLineTheme: Record<Theme, Konva.NodeConfig> = {
  light: {
    stroke: "#F0F0F0",
  },
  dark: {
    stroke: "#314166",
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
