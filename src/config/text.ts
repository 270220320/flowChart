import Konva from "konva";
import { Theme } from "./theme";

const defaultText = "文本";
export const Text: Record<Theme, Konva.TextConfig> = {
  light: {
    fill: "#000",
    text: defaultText,
    fontSize: 12,
  },
  dark: {
    fill: "#fff",
    text: defaultText,
    fontSize: 12,
  },
};
