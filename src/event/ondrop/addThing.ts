import Konva from "konva";
import INLEDITOR from "src";
import { createThingGroup } from "src/element/group";
import { Thing } from "src/data/thing";
import layer from "src/util/layer";

// 根据thingCode 缓存文件
const cacheList = {};

export default (ie: INLEDITOR, x: number, y: number, useThing: Thing) => {
  const group = createThingGroup(useThing);
  const layerThing = layer(ie.stage, "thing");

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
    layerThing.add(group);
    layerThing.draw();
  });
};
