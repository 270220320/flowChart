import Konva from "konva";
import INLEDITOR from "src";
import layer from "../layer";

export const turnDrag = (ie: INLEDITOR, state: boolean) => {
  const lay = layer(ie.stage, "thing");
  lay.children?.forEach((ele: Konva.Node) => {
    ele.setAttrs({ draggable: state });
  });
};
