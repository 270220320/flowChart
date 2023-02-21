import { BELT } from "@/component";
import computedXY from "@/util/computedXY";
import { getCustomAttrs, setCustomAttrs } from "@/util/customAttr";
import Konva from "konva";
import _ from "lodash";
import { UUID } from "src/util/uuid";
const cacheImgList: Record<string, Konva.Image> = {};
export const createImage: (img: string) => Promise<Konva.Image> = (img) => {
  if (cacheImgList[img]) {
    const image = cacheImgList[img].clone();
    image.setId(UUID());
    return Promise.resolve(image);
  }
  return new Promise<Konva.Image>((res, rej) => {
    Konva.Image.fromURL(img, (darthNode: Konva.Image) => {
      const { width, height } = darthNode.attrs.image;
      darthNode.setAttrs({
        myWidth: width,
        myHeight: height,
        src: img,
        name: "thingImage",
        id: UUID(),
      });
      darthNode.cache();
      cacheImgList[img] = darthNode;
      res(cacheImgList[img].clone());
    });
  });
};
export const changeThingComponentState = (
  stage: Konva.Stage,
  node: Konva.Image
) => {
  const { thing } = getCustomAttrs(node);
  const { componentName } = node.getAttrs();

  if (componentName && componentName === "belt") {
    const belt = new BELT(stage, { thingInfo: thing });
    belt.render(2);
  }
};

export const changeThingImage = async (
  imageNode: Konva.Image,
  src: string,
  state: string
) => {
  const parent = imageNode.getParent();
  const { x, y, height, width } = imageNode.getClientRect();
  const stage = imageNode.getStage();
  setCustomAttrs(parent, { state });
  const { id, cData } = imageNode.getAttrs();

  imageNode.remove();

  const newImage = await createImage(src);

  newImage.getAttrs().image.src = src;
  const XY = computedXY(stage, x, y);
  newImage.setAttrs({
    x: XY.x,
    y: XY.y,
    height: height,
    width: width,
    id,
    cData,
  });
  parent.add(newImage);
};
