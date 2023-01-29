import Konva from "konva";
import { TextConfig } from "konva/lib/shapes/Text";

export const createText = (config: TextConfig) =>
  new Konva.Text({
    ...config,
    fontFamily: "Calibri",
    fill: "black",
    fontSize: 14,
  });
