import data from "../../data/data";
import createThingText from "src/util/createThingText";
import { getThingGroup, getThingGroups } from "src/element/group";
import addThing from "./addThing";
import layer from "src/util/layer";
import Konva from "konva";
import INLEDITOR from "src";

export const createElements = (ie: INLEDITOR) => {
  setTimeout(() => {
    const w = ie.stage.width();
    const mx = 200;
    let sx = 0;
    let sy = 0;
    let line = 0;
    let index = 0;
    const img = data[0].img;
    for (let i of data) {
      if (sx >= w * 2) {
        sx = 0;
        line += mx;
      }
      index++;
      // i.img = img;
      addThing(ie, (sx += mx), line, i);
      setTimeout(() => {
        const ct = createThingText.bind(ie)(i.iu);
        ct?.advanced({
          labelv: "string：",
          value: i.iu,
          unitval: "string",
          code: "123123",
        });
      }, 1000);
    }
  }, 100);
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
