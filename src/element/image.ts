import { BELT, changeBeltState } from "@/component";
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
      console.log(darthNode);
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
  node: Konva.Image,
  state: string | number
) => {
  const { thing } = getCustomAttrs(node.parent);
  const { componentName } = node.getAttrs();

  if (componentName && componentName === "belt") {
    // const belt = new BELT(stage, { thingInfo: thing });
    // belt.render(state as number);
    changeBeltState(stage, state, thing.iu);
  }
};

export const changeThingImage = async (
  imageNode: Konva.Image,
  src: string,
  state: string
) => {
  const parent = imageNode.getParent();
  const data = _.cloneDeep(imageNode.getAttrs());
  setCustomAttrs(parent, { state });
  imageNode.remove();
  const newImage = await createImage(src);
  newImage.getAttrs().image.src = src;
  delete data.image;
  // const XY = computedXY(stage, x, y);
  newImage.setAttrs(data);
  parent.add(newImage);
  return new Promise((res) => {
    newImage.getAttrs().image.onload = () => {
      parent.getLayer().draw();
      res(newImage);
    };
  });
};
