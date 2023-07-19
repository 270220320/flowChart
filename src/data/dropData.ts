import { createThingTexts } from "@/element/text";
import inleditor, { getCustomAttrs, Theme } from "@/main";
import computedXY from "@/util/computedXY";
import layer from "@/util/layer";
import Konva from "konva";
import { groupNames } from "src/element/group";
import { thingTextInfo } from "./cdata";
import { Thing } from "./thing";

export type THINGTEXTINFO = {
  type: keyof typeof groupNames;
  info: thingTextInfo;
  position?: { x: number; y: number };
};
export type THINGTEXT = Array<THINGTEXTINFO>;
export interface TransferData {
  thing: Thing;
  thingText?: THINGTEXT;
}

export const getTransferData: (i: string) => TransferData = (st) => {
  let transferdata!: TransferData;
  try {
    transferdata = JSON.parse(st) as TransferData;
  } catch (error) {
    new Error("拖拽物模型，传输数据有问题.");
  }
  return transferdata;
};

export const setTransferData = () => {};

// 获取物模型的所有文字内容
export const getThingChildPosition = (stage: Konva.Stage, iu: string) => {
  const thing = stage.findOne(`#${iu}`) as Konva.Group;
  const childText = thing
    .getChildren()
    .filter(
      (item) => !item.hasName("thingImage") && item.className !== "Arrow"
    );
  const childImage = thing
    .getChildren()
    .find((item) => item.hasName("thingImage"));
  const childLine = thing
    .getChildren()
    .find((item) => item.className === "Arrow");
  const { x, y } = childImage
    ? childImage.getAbsolutePosition()
    : {
        x: childLine.attrs.points[0],
        y: childLine.attrs.points[1],
      };
  const thingXY = computedXY(stage, x, y);
  const arr: THINGTEXT = [];
  for (let text of childText) {
    const iRect = text.getAbsolutePosition();
    const ItemXY = computedXY(stage, iRect.x, iRect.y);
    const { v, code, label, unit, id } = getCustomAttrs(text).thingTextInfo;
    arr.push({
      type: text.name() as keyof typeof groupNames,
      position: {
        x: ItemXY.x - thingXY.x,
        y: ItemXY.y - thingXY.y,
      },
      info: {
        v,
        code,
        id,
        label,
        unit,
      },
    });
  }
  return arr;
};
// 设置物模型图片的缩放
export const setThingScale = (
  stage: Konva.Stage,
  iu: string,
  scaleX: number,
  scaleY: number
) => {
  const thingLayer = layer(stage, "thing");
  const thing = thingLayer.findOne(`#${iu}`) as Konva.Group;
  thing.children[0].setAttrs({ scaleX, scaleY });
};
// 设置物模型的文字位置 !!组件需要延迟调用！！
export const setThingChildPosition = (
  ie: inleditor,
  iu: string,
  themeType: Theme,
  arr: THINGTEXT
) => {
  const stage = ie.getStage();
  const thing = stage.findOne(`#${iu}`) as Konva.Group;
  debugger;
  const creatext = createThingTexts(ie, iu, themeType);
  const { width, height, x, y } = thing.getClientRect();
  const cb = (g: Konva.Group, i: THINGTEXTINFO) => {
    if (!i.position) {
      const xy = computedXY(
        stage,
        x + (width - g.getClientRect().width) / 2,
        y + height
      );
      g.setPosition({
        x: xy.x,
        y: xy.y,
      });
    } else {
      const xy = computedXY(stage, x, y);
      g.setPosition({
        x: i.position.x + xy.x,
        y: i.position.y + xy.y,
      });
    }
  };
  creatext.batchAddText(arr, cb);
};
