import { createImage } from "@/element";
import Konva from "konva";

export default (url?: string): Promise<Konva.Star | Konva.Image> => {
  if (url) {
    return createImage(url);
  } else {
    return Promise.resolve(
      new Konva.Star({
        x: 0,
        y: 19,
        numPoints: 5,
        innerRadius: 2,
        outerRadius: 3,
        fill: "black",
        strokeWidth: 0,
      })
    );
  }
};
