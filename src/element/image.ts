import { BELT } from "@/component";
import { getCustomAttrs, setCustomAttrs } from "@/util/customAttr";
import Konva from "konva";
import { Group } from "konva/lib/Group";
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
        // draggable: true,
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

  setCustomAttrs(parent, { state });
  const attrs = _.cloneDeep(imageNode.getAttrs());
  imageNode.remove();
  const newImage = await createImage(src);
  attrs.image.src = src;
  newImage.setAttrs(attrs);
  parent.add(newImage);
};
