import Konva from "konva";
const cacheImgList: Record<string, Konva.Image> = {};
export const createImage = (img: string) => {
  if (cacheImgList[img]) return Promise.resolve(cacheImgList[img].clone());
  return new Promise<Konva.Image>((res, rej) => {
    Konva.Image.fromURL(img, (darthNode: Konva.Image) => {
      const { width, height } = darthNode.attrs.image;
      darthNode.setAttrs({
        myWidth: width,
        myHeight: height,
        src: img,
      });
      darthNode.cache();
      cacheImgList[img] = darthNode;
      res(cacheImgList[img]);
    });
  });
};

export const loadImage = (imageNode: Konva.Image) => {
  const src = imageNode.getAttr("src");
  const image = new Image();
  image.src = src;
  image.onload = () => {
    imageNode.image(image);
    (imageNode as any).getLayer().batchDraw();
  };
};
