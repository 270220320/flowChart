import Konva from "konva";
import INLEDITOR from "@/index";
import layer from "../layer";

export const turnDrag = (stage: Konva.Stage, state: boolean) => {
  const lay = layer(stage, "thing");
  // lay.setAttrs({ draggable: state });
  lay.children?.forEach((ele: Konva.Node) => {
    if (ele.name() !== "field") {
      ele.setAttrs({ draggable: state });
    }
  });
};
