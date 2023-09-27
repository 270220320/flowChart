import { BELT, changeBeltState, changeState } from "@/component";
import { getCustomAttrs, setCustomAttrs } from "@/util/customAttr";
import Konva from "konva";
import _ from "lodash";
import { UUID } from "src/util/uuid";
import "../assets/gifler.js";

const cacheImgList: Record<string, Konva.Image> = {};
export const createImage: (img: string, parent) => Promise<Konva.Image> = (
  img,
  parent: Konva.Node
) => {
  if (!img || img === "null") {
    img = "/micro-assets/platform-web/close.png";
  }
  if (cacheImgList[img]) {
    const image = cacheImgList[img].clone();
    image.setId(UUID());
    return Promise.resolve(image);
  }
  return new Promise<Konva.Image | Event>((res, rej) => {
    if (img.indexOf(".gif") >= 0) {
      const canvas = document.createElement("canvas");
      // use external library to parse and draw gif animation
      function onDrawFrame(ctx, frame) {
        // update canvas size
        canvas.width = frame.width;
        canvas.height = frame.height;
        // update canvas that we are using for Konva.Image
        ctx.drawImage(frame.buffer, 0, 0);
        // redraw the layer
        parent.getLayer().draw();
      }

      (window as any).gifler(img).frames(canvas, onDrawFrame);
      const image = new Konva.Image({
        // myWidth: 200,
        // myHeight: 100,
        image: canvas,
        name: "thingImage",
        id: UUID(),
      });
      // parent.getLayer().add(image);
      res(image);
    } else {
      Konva.Image.fromURL(
        img,
        (darthNode: Konva.Image) => {
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
        },
        (err: Event) => {
          img = "/micro-assets/platform-web/close.png";
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
        }
      );
    }
  });
};
export const changeThingComponentState = (
  stage: Konva.Stage,
  node: Konva.Image,
  state: string | number
) => {
  const { thing } = getCustomAttrs(node.parent);
  const { componentName } = node.getAttrs();

  if (componentName && componentName === "BELT") {
    // const belt = new BELT(stage, { thingInfo: thing });
    // belt.render(state as number);
    changeBeltState(stage, state, thing.iu);
  }
  if (componentName && componentName === "Scraper") {
    // const belt = new BELT(stage, { thingInfo: thing });
    // belt.render(state as number);
    changeState(stage, state, thing.iu);
  }
};

export const changeThingImage = async (
  imageNode: Konva.Image,
  src: string,
  state: string
) => {
  const parent = imageNode.parent;
  const data = _.cloneDeep(imageNode.getAttrs());
  imageNode.destroy();
  const newImage = await createImage(src);
  newImage.getAttrs().image.src = src;
  delete data.image;
  newImage.setAttrs(data);
  parent?.add(newImage);
};
