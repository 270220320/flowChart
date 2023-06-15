import Konva from "konva";
import { createImage } from "@/element/image";

export default async (stage: Konva.Stage) => {
  await Promise.all(
    stage.find("Image").map((imageNode) => {
      return new Promise(async (resolve) => {
        const parent = imageNode.getParent();
        const attrs = imageNode.getAttrs();
        if (parent.getAttrs().componentName === "video") {
          resolve(1);
        }
        if (attrs.src) {
          const newImage: Konva.Node | Event = await createImage(attrs.src);
          imageNode.remove();
          newImage.setAttrs(attrs);
          parent.add(newImage);
        }
        resolve(1);
      });
    })
  );
};
