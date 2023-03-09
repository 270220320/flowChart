import INLEDITOR from "@/index";
import { exitEditLine } from "@/util/line/editLine";
import stageTofit from "@/util/stageTofit";
import Konva from "konva";
import remove from "./remove";

export default (ie: INLEDITOR, cb?: () => void) => {
  const container = ie.getContainer();
  container.addEventListener("keydown", (e) => {
    if (e.code === "Backspace" || e.code === "Delete") {
      exitEditLine(ie.getStage());
      remove(ie, e);
    }
    if (e.code === "Space") {
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
