import Konva from "konva";
import INLEDITOR from "src";
import { Thing } from "src/data/thing";
import { computedXYByEvent } from "src/util/computedXY";
import layer from "src/util/layer";
import addThing from "./addThing";
import data from "../../data/data";
import createThingText from "src/util/createThingText";
import { getThingGroup, getThingGroups } from "src/element/group";

export default (
  ie: INLEDITOR,
  dom: HTMLElement,
  callback?: (e: DragEvent) => void
) => {
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
          value: "stringaaaaaa",
          unitval: "string",
          code: "123123",
        });
      }, 1000);
    }
  }, 100);

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

  dom.ondragenter = function (e) {
    e.preventDefault();
  };

  dom.ondragover = function (e) {
    e.preventDefault();
  };

  dom.ondragleave = function (e) {
    e.preventDefault();
  };

  dom.ondrop = (e) => {
    e.preventDefault();
    let thing = e.dataTransfer?.getData("thing");
    const useThing = thing ? (JSON.parse(thing) as Thing) : null;
    const { x, y } = computedXYByEvent(ie.stage, e);
    // 上传thing
    if (useThing) addThing(ie, x, y, useThing);
  };
};
