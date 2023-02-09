import data from "../../data/data";
import { createThingText } from "src/element/text";
import { getThingGroup } from "src/element/group";
import layer from "src/util/layer";
import Konva from "konva";
import INLEDITOR from "@/index";
import { createThingImageGroup } from "@/element/thing";

export const createElements = (ie: INLEDITOR) => {
  const layerThing = layer(ie.stage, "thing");

  const w = ie.stage.width();
  const mx = 200;
  let sx = 0;
  let line = 0;
  let index = 0;
  for (let i of data) {
    if (sx >= w * 2) {
      sx = 0;
      line += mx;
    }
    index++;
    createThingImageGroup(layerThing, i as any, (sx += mx), line);
    setTimeout(() => {
      const ct = createThingText(ie.stage, i.iu, ie.theme);
      ct?.advanced({
        labelv: "string：",
        value: i.iu,
        unitval: "string",
        code: "123123",
      });
    }, 1000);
  }
};

export const createAnimate = (ie: INLEDITOR) => {
  const fua = () => {
    setTimeout(() => {
      const n = () => Math.floor(Math.random() * (data.length - 0 + 1)) + 1;
      const layer1 = layer(ie.stage, "thing");
      const group = getThingGroup(layer1, data[n()].iu);
      const group1 = getThingGroup(layer1, data[n()].iu);
      var tween = new Konva.Tween({
        node: group.find("Image")[0],
        duration: 1,
        rotation: 360,
      });
      var tween1 = new Konva.Tween({
        node: group1.find("Image")[0],
        duration: 1,
        rotation: 360,
      });
      tween.play();
      tween1.play();
      setTimeout(() => {
        tween.reverse();
        tween1.reverse();
        fua();
      }, 1500);
    }, 2000);
  };

  fua();
};
