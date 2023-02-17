import Konva from "konva";
import { defaultTheme } from "@/config/theme";
import { cData } from "../data/cdata";
import { Thing } from "../data/thing";
import { setCustomAttrs } from "@/util/customAttr";
import { createThingGroup } from "./group";
import { createImage } from "./image";
import { createThingDefaultText } from "./text";

export const createComponentThingGoup = (
  parent: Konva.Group | Konva.Layer,
  useThing: Thing,
  image: Konva.Group
) => {
  const group = createThingGroup(useThing);
  const text = createThingDefaultText(
    defaultTheme,
    {
      v: useThing.ic,
      code: "CODE",
      label: "编码：",
    },
    { x: 0, y: 0 }
  );
  const textVal = text.findOne(".val");
  text.setAttrs({
    x: image.attrs.x + (image.width() - textVal.width()) / 2,
    y: image.attrs.y + image.height(),
    draggable: true,
  });
  group.add(image, text);
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
  const image = await createImage(img);
  const text = createThingDefaultText(
    defaultTheme,
    {
      v: useThing.ic,
      code: "CODE",
      label: "编码：",
    },
    { x: 0, y: 0 }
  );
  const textVal = text.findOne(".val");
  const { width, height } = image.attrs.image;
  image.setAttrs({
    x: x - width / 2,
    y: y - height / 2,
  });
  setCustomAttrs(image, cData);
  text.setAttrs({
    x: image.attrs.x + (image.width() - textVal.width()) / 2,
    y: image.attrs.y + image.height(),
    draggable: true,
  });
  group.add(image, text);

  parent.add(group);
  parent.draw();
  return Promise.resolve(group);
};
