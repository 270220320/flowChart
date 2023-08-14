import { getCustomAttrs } from "@/main";
import Konva from "konva";

export default async (stage: Konva.Stage) => {
  stage.find(".selfText").map((text) => {
    text.on("transform", (e) => {
      text.setAttrs({ width: text.width() * text.scaleX(), scaleX: 1 });
    });
  });
};
