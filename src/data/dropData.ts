import { createThingText } from "@/element/text";
import { getCustomAttrs, Theme } from "@/main";
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
  const thingLayer = layer(stage, "thing");
  const thing = thingLayer.findOne(`#${iu}`) as Konva.Group;
  const child = thing
    .getChildren()
    .filter((item) => !item.hasName("thingImage"));
  const { x, y } = thing.getClientRect();
  const arr: THINGTEXT = [];
  for (let i of child) {
    const iRect = i.getClientRect();
    const { v, code, label, unit } = getCustomAttrs(i).thingTextInfo;
    arr.push({
      type: i.name() as keyof typeof groupNames,
      position: {
        x: iRect.x - x,
        y: iRect.y - y,
      },
      info: {
        v,
        code,
        label,
        unit,
      },
    });
  }
  return arr;
};
// 设置物模型的文字位置
export const setThingChildPosition = (
  stage: Konva.Stage,
  iu: string,
  themeType: Theme,
  arr: THINGTEXT
) => {
  const thingLayer = layer(stage, "thing");
  const thing = thingLayer.findOne(`#${iu}`) as Konva.Group;
  const creatext = createThingText(stage, iu, themeType);
  const { x, y, width, height } = thing.getClientRect();
  const cb = (g: Konva.Group, i: THINGTEXTINFO) => {
    if (!i.position) {
      const xy = computedXY(
        stage,
        x + (width - g.getClientRect().width) / 2,
        y + height
      );
      g.setAttrs({
        x: xy.x,
        y: xy.y,
      });
    } else {
      const xy = computedXY(stage, i.position.x + x, i.position.y + y);
      g.setAttrs({
        x: xy.x,
        y: xy.y,
      });
    }
  };
  for (let i of arr) {
    if (i.type === "thingDefTextGroup") {
      creatext.def(i.info.v, i.info.code, (g) => {
        cb(g, i);
      });
    } else {
      creatext.advanced(i.info, (g) => {
        cb(g, i);
      });
    }
  }
};
