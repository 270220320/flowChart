import { isComponentChildren } from "@/component";
import { MapTitleTheme } from "@/config";
import { Theme } from "@/main";
import Konva from "konva";
import layer from "./layer";
import stageTofit from "./stageTofit";
export * from "./customAttr";
export const fileToBase64 = (files: FileList) => {
  const promises = [];
  for (let i = 0; i < files.length; i++) {
    const file = files.item(i);
    if (file) {
      promises.push(
        new Promise((res, rej) => {
          try {
            let fileRead = new FileReader();
            fileRead.readAsDataURL(file);
            fileRead.onload = (data) => {
              res(data.target.result);
            };
          } catch (error) {
            rej(error);
          }
        })
      );
    }
  }
  return Promise.all(promises);
};

export const getMouseOver = (
  point: { x: number; y: number },
  stage: Konva.Stage
) => {
  let node: Konva.Node = layer(stage, "thing").getIntersection(point);
  if (isComponentChildren(node)) {
    return node.parent;
  }
  if (node.name() === "field") {
    node = undefined;
  }
  return node;
};

export const addMapTitle = (
  stage: Konva.Stage,
  title: string,
  themeType: Theme
) => {
  const tt = stage.findOne(".mapTitle");

  if (tt) {
    tt.remove();
  }
  const texta = new Konva.Text({
    text: title,
    fontSize: 24,
    name: "mapTitle",
  });
  const tattrs = texta.getAttrs();
  delete tattrs.fill;
  const mtt = MapTitleTheme[themeType];

  const attr = {
    ...mtt,
    ...tattrs,
    fillLinearGradientEndPoint: { x: texta.width(), y: 0 },
  };
  const scale = stage.scaleX();
  const { x, y } = stage.getPosition();
  const stageWidth = stage.width();

  const text = new Konva.Text({
    ...attr,
    x: (x + (stageWidth - texta.width()) / 2) / scale,
    y: y / scale,
    draggable: true,
  });
  texta.remove();
  const lay = layer(stage, "thing");
  lay.add(text);
};
