import Konva from "konva";
import INLEDITOR from "src";
import { createText } from "src/config/text.config";
import { Thing } from "src/data/thing";
import layer from "src/util/layer";

export default (
  ie: INLEDITOR,
  x: number,
  y: number,
  useThing: Thing | null
) => {
  const group = new Konva.Group({
    cdata: {
      thihg: useThing,
    },
    draggable: true,
    id: useThing?.iu,
    name: "thingGroup",
  });
  Konva.Image.fromURL(useThing?.img, (darthNode: Konva.Image) => {
    const { width, height } = darthNode.attrs.image;
    darthNode.setAttrs({
      x: x - width / 2,
      y: y - height / 2,
      myWidth: width,
      myHeight: height,
      src: useThing?.img,
    });
    group.add(darthNode);

    const layerThing = layer(ie, "thing");
    layerThing.add(group);
    layerThing.draw();
  });
};
