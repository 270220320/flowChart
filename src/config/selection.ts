import Konva from "konva";
import { Theme } from "./theme";

export const SelectionTheme: Record<Theme, Konva.NodeConfig> = {
  light: {
    fill: "transparent",
    stroke: "black",
  },
  dark: {
    fill: "transparent",
    stroke: "#fff",
  },
};
