import INLEDITOR from "@/index";
import { exitEditLine } from "@/util/line/editLine";
import stageTofit from "@/util/stageTofit";
import Konva from "konva";
import remove from "./remove";
import { groupNames } from "@/element";
import inputText from "@/element/texts/inputText";

export default (ie: INLEDITOR, cb?: () => void) => {
  const container = ie.getContainer();
  container.addEventListener("keydown", (e) => {
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
    cb ? cb() : null;
  });
  container.addEventListener("keyup", (e) => {
    if (e.code === "Space") {
      const eles = document.getElementById("myCanvas").children;
      Array.from(eles).forEach((element: HTMLElement) => {
        element.style.cursor = "default";
      });
      ie.getStage().setAttrs({ draggable: false });
      ie.setDrawState("default");
    }
    cb ? cb() : null;
  });
};
