import Konva from "konva";
import { createImage } from "src/element/image";

export default (stage: Konva.Stage) => {
  stage.find("Image").forEach(async (imageNode) => {
    const parent = imageNode.getParent();
    const attrs = imageNode.getAttrs();
    const newImage = await createImage(attrs.src);
    imageNode.remove();
    newImage.setAttrs(attrs);
    parent.add(newImage);
  });
};
