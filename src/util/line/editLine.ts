import Konva from "konva";
import INLEDITOR from "../..";

export const enterEditLine = (line: Konva.Arrow, ie: INLEDITOR) => {
  ie.stage.setAttrs({ draggable: false });
  //   ie.drawState
  line.on("mousedown", () => {
    console.log(222);
    line.on("mousemove", () => {
      console.log(333);
    });
  });
};
