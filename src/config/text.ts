import Konva from "konva";
import { Theme } from "./theme";

const defaultText = "文本";
export const Text: Record<Theme, Konva.TextConfig> = {
  light: {
    fill: "#354052",
    text: defaultText,
    fontSize: 40,
  },
  dark: {
    fill: "#9CA9C7",
    text: defaultText,
    fontSize: 40,
  },
};
