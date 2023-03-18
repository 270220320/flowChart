import { createImage } from "@/element";
import { fileToBase64 } from "@/util";
import { computedXYByEvent } from "@/util/computedXY";
import layer from "@/util/layer";
import Konva from "konva";

export default async (
  stage: Konva.Stage,
  e?: DragEvent | Event,
  url?: string
) => {
  let urls;

  if (url) {
    urls = [url];
  } else {
    urls = await fileToBase64((e as DragEvent).dataTransfer.files);
  }

  const thingLayer = layer(stage, "thing");
  for (let i of urls) {
    const image = await createImage(i);
    image.draggable(true);
    image.name("customImage");
    const { width, height } = image.getAttrs().image;
    const { x, y } = computedXYByEvent(stage, e);
    image.setAttrs({
      x: x - width / 2,
      y: y - height / 2,
    });
    thingLayer.add(image);
  }
};
