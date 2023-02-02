import Konva from "konva";
import { Theme } from "./theme";

export interface ScaleThemeType extends Konva.NodeConfig {}

export const ScaleTheme: Record<Theme, ScaleThemeType> = {
  light: {
    background: "#fff",
    thickness: 20,
    lineFill: "#000",
    fontColor: "#354052",
    fontOpacity: 0.5,
  },
  dark: {
    background: "#fff",
    thickness: 20,
    lineFill: "#000",
    fontColor: "#354052",
    fontOpacity: 0.5,
  },
};
