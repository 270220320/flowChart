import Konva from "konva";
import { defaultTheme } from "src/config/theme";
import { Thing } from "src/data/thing";
import createThingText from "src/util/createThingText";
import { createThingGroup } from "./group";
import { createImage } from "./image";
import { createText, createThingDefaultText } from "./text";

export const createThingImageGroup = async (
  parent: Konva.Group | Konva.Layer,
  useThing: Thing,
  x: number,
  y: number
) => {
  const group = createThingGroup(useThing);
  const { img } = useThing;
  const image = await createImage(img);
  const text = createThingDefaultText(defaultTheme, {
    value: useThing.ic,
    code: "CODE",
  });
  const textVal = text.findOne(".val") as any;
  const { width, height } = image.attrs.image;
  image.setAttrs({
    x: x - width / 2,
    y: y - height / 2,
  });
  textVal.setAttrs({
    x: image.attrs.x + (image.width() - textVal.width()) / 2,
    y: image.attrs.y + image.height(),
    draggable: true,
  });
  group.add(image, text);

  parent.add(group);
  parent.draw();
};
