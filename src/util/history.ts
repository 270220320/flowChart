import Konva from "konva";
import INLEDITOR from "..";
import { exitEditLine } from "./line/editLine";
import { clearTransFormer } from "@/event/selectItem";

export const undoReset = async (ie: INLEDITOR) => {
  await ie.init(ie.historyArr[ie.historyArr.length - 1]);
  const stage = ie.getStage();
  exitEditLine(stage);
  clearTransFormer(stage);
  ie.opt.onUndoCb?.();
};
