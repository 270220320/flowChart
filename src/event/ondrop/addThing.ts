import Konva from "konva";
import INLEDITOR from "src";
import { createThingGroup } from "src/element/group";
import { Thing } from "src/data/thing";
import layer from "src/util/layer";

export default (ie: INLEDITOR, x: number, y: number, useThing: Thing) => {
  const group = createThingGroup(useThing);
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

    const layerThing = layer(ie.stage, "thing");
    layerThing.add(group);
    layerThing.draw();
  });
};
