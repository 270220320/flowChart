import Konva from "konva";
import { Theme } from "./theme";

export const FieldTheme: Record<Theme, Konva.NodeConfig> = {
  light: {
    fill: "white",
    out: "#EFF2F6",
  },
  dark: {
    fill: "#1B2C55",
    out: "#dddddd",
  },
};
