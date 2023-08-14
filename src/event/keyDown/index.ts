import INLEDITOR from "@/index";
import { exitEditLine } from "@/util/line/editLine";
import stageTofit from "@/util/stageTofit";
import Konva from "konva";
import remove from "./remove";
import { groupNames } from "@/element";
import inputText from "@/element/texts/inputText";

export const keydown = (e, ie) => {
  const stage = ie.getStage();
  const trans = stage.findOne("Transformer") as Konva.Transformer;
  const nodes = trans?.getNodes();
  if (ie.opt.isPreview) {
    const input = stage.findOne(".cursor");
    if (input) {
      inputText.keyIn(e, input.parent as Konva.Group);
    }
    return;
  }
  if (e.code === "Delete") {
    exitEditLine(ie.getStage());
    remove(ie, e);
  } else if (
    nodes?.length === 1 &&
    nodes[0].name() === groupNames.thingInputGroup
  ) {
    // 输入框
    inputText.keyIn(e, nodes[0] as Konva.Group);
  } else if (e.code === "Backspace") {
    exitEditLine(ie.getStage());
    remove(ie, e);
  } else if (e.code === "Space") {
    const eles = document.getElementById("myCanvas").children;
    Array.from(eles).forEach((element: HTMLElement) => {
      element.style.cursor = "grab";
    });

    ie.getStage().setAttrs({ draggable: true });
    ie.setDrawState("dragStage");
  }
};
export const keyup = (e, ie) => {
  if (e.code === "Space") {
    const eles = document.getElementById("myCanvas").children;
    Array.from(eles).forEach((element: HTMLElement) => {
      element.style.cursor = "default";
    });
    ie.getStage().setAttrs({ draggable: false });
    ie.setDrawState("default");
  } else if (e.ctrlKey && e.code === "KeyZ") {
    // 撤销
    if (ie.historyArr.length >= 2) {
      ie.historyArr.pop();
      ie.init(ie.historyArr[ie.historyArr.length - 1]);
    }
  }
};
export default (ie: INLEDITOR, bind?: boolean) => {
  const container = ie.getContainer();
  if (bind !== false) {
    container.addEventListener("keydown", ie.keyDown);
    container.addEventListener("keyup", ie.keyUp);
  } else {
    container.removeEventListener("keydown", ie.keyDown);
    container.removeEventListener("keyup", ie.keyUp);
  }
};
