import Konva from "konva";
import { createImage } from "@/element/image";
import { getCustomAttrs } from "@/main";

export default async (stage: Konva.Stage) => {
  await Promise.all(
    stage.find("Image").map((imageNode) => {
      return new Promise(async (resolve) => {
        if (imageNode.name() === "thingImage") {
          const parent = imageNode.getParent();
          imageNode.attrs.src = getCustomAttrs(parent).thing.img;
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
        }
        // if (imageNode.parent?.parent?.attrs.componentName === "StoreHouse") {
        //   const parent = imageNode.getParent();
        //   imageNode.attrs.src = getCustomAttrs(
        //     parent.parent.parent
        //   ).thing.fullImg;
        //   const attrs = imageNode.getAttrs();
        //   if (attrs.src) {
        //     const newImage: Konva.Node | Event = await createImage(attrs.src);
        //     imageNode.remove();
        //     newImage.setAttrs(attrs);
        //     parent.add(newImage);
        //   }
        // }
        resolve(1);
      });
    })
  );
};
