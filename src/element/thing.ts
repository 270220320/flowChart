import Konva from "konva";
import { defaultTheme } from "@/config/theme";
import { cData } from "../data/cdata";
import { Thing } from "../data/thing";
import { setCustomAttrs } from "@/util/customAttr";
import { createThingGroup } from "./group";
import { createImage } from "./image";

export const createComponentThingGoup = (
  parent: Konva.Group | Konva.Layer,
  useThing: Thing,
  image: Konva.Group
) => {
  const group = createThingGroup(useThing);
  group.add(image);
  parent.add(group);
  return group;
};
export const createThingImageGroup = async (
  parent: Konva.Group | Konva.Layer,
  useThing: Thing,
  x: number,
  y: number
) => {
  const group = createThingGroup(useThing);
  const { img } = useThing;
  const image = await createImage(img, parent);

  const { width, height } = image.attrs.image;
  image.setAttrs({
    x: x - width / 2,
    y: y - height / 2,
  });
  setCustomAttrs(image, cData);

  group.add(image);

  parent.add(group);
  parent.draw();
  return Promise.resolve(group);
};
