import Konva from "konva";
import layer from "../layer";
import INLEDITOR from "@/index";
import { FieldTheme } from "../../config/field";

export const addField = (ie: INLEDITOR) => {
  const lay = layer(ie.getStage(), "thing");
  const field: Konva.Node = ie.getStage().find(".field")[0];
  const theme = ie.getTheme();
  if (!field) {
    const rect1 = new Konva.Rect({
      x: 0,
      y: 0,
      width: 1920,
      height: 1080,
      name: "field",
      fill: FieldTheme[theme].fill,
      stroke: "black",
      strokeWidth: 1,
    });
    // add the shape to the layer
    lay.add(rect1);
  }
};
