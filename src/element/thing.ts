import Konva from "konva";
import { Thing } from "src/data/thing";
import { createThingGroup } from "./group";
import { createImage } from "./image";

export const createThingImageGroup = async (
  parent: Konva.Group | Konva.Layer,
  useThing: Thing,
  x: number,
  y: number
) => {
  const group = createThingGroup(useThing);
  const { img } = useThing;
  const image = await createImage(img);
  const { width, height } = image.attrs.image;
  image.setAttrs({
    x: x - width / 2,
    y: y - height / 2,
  });
  group.add(image);
  parent.add(group);
  parent.draw();
};
