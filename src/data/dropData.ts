import { groupNames } from "src/element/group";
import { thingTextInfo } from "./cdata";
import { Thing } from "./thing";

export type THINGTEXT = Array<{
  type: keyof typeof groupNames;
  info: thingTextInfo;
  position: { x: number; y: number };
}>;
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
