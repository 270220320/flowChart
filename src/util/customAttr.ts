import Konva from "konva";
import { Thing } from "src/data/thing";

interface customData {
  [key: string]: any;
  thing?: Thing;
  type?: string;
  code?: string;
}

export const getCustomAttrs: (
  e: Konva.Stage | Konva.Group | Konva.Node
) => customData = (e) => {
  return e.getAttr("cdata") || {};
};

export const setCustomAttrs = (
  e: Konva.Stage | Konva.Group | Konva.Node,
  data: customData
) => {
  const cdata = getCustomAttrs(e);
  e.setAttr("cdata", Object.assign({}, cdata, data));
};
