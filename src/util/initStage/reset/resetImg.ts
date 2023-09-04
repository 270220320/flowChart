import Konva from "konva";
import { createImage } from "@/element/image";
import { getCustomAttrs } from "@/main";

export default async (stage: Konva.Stage) => {
  const imgArr = stage.find("Image");
  await Promise.all(
    imgArr.map((imageNode, index) => {
      return new Promise(async (resolve) => {
        if (
          imageNode.name() === "thingImage" ||
          imageNode.name() === "customImage" ||
          imageNode.parent.attrs.componentName === "Scraper"
        ) {
          const parent = imageNode.getParent();
          if (imageNode.name() === "thingImage") {
            imageNode.attrs.src = getCustomAttrs(parent).thing.img;
          }
          if (parent.getAttrs().componentName === "video") {
            resolve(1);
          }
          const attrs = imageNode.getAttrs();

          if (attrs.src) {
            // imgArr[index] = await createImage(attrs.src);
            const newImage: Konva.Node | Event = await createImage(attrs.src);
            imageNode.remove();
            newImage.setAttrs(attrs);
            parent.add(newImage);
          }
        }
        resolve(1);
      });
    })
  );
};
