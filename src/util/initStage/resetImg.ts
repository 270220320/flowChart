import Konva from "konva";

export default (stage: Konva.Stage) => {
  stage.find("Image").forEach((imageNode: any) => {
    const src = imageNode.getAttr("src");
    const image = new Image();
    image.onload = () => {
      imageNode.image(image);
      imageNode.getLayer().batchDraw();
    };
    image.src = src;
  });
};
