import Konva from "konva";
import { getCustomAttrs, setCustomAttrs } from "../customAttr";

export const switchArraw = (line: Konva.Node, to: string) => {
  const cdata = getCustomAttrs(line);
  const newNode = new Konva[to](line.attrs);
  setCustomAttrs(newNode, cdata);
  line.parent.add(newNode);
  line.destroy();
};
