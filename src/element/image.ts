import Konva from "konva";
import _ from "lodash";
const cacheImgList: Record<string, Konva.Image> = {};
export const createImage: (img: string) => Promise<Konva.Image> = (img) => {
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

export const changeImage = async (imageNode: Konva.Image, src: string) => {
  const parent = imageNode.getParent();
  const attrs = _.cloneDeep(imageNode.getAttrs());
  imageNode.remove();
  const newImage = await createImage(src);
  attrs.image.src = src;
  newImage.setAttrs(attrs);
  parent.add(newImage);
};
