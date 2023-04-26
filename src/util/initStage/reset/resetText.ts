import { getCustomAttrs } from "@/main";
import Konva from "konva";

export default async (stage: Konva.Stage) => {
  stage.find(".selfText").map((textNode) => {
    const info = getCustomAttrs(textNode);
    textNode.setAttrs({ width: info.width });
  });
};
