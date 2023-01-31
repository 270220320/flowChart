import Konva from "konva";

export const getCustomAttrs = (e: Konva.Stage | Konva.Group | Konva.Node) => {
  return e.getAttr("cdata") || {};
};

export const setCustomAttrs = (
  e: Konva.Stage | Konva.Group | Konva.Node,
  data: any
) => {
  const cdata = getCustomAttrs(e);
  e.setAttr("cdata", Object.assign({}, cdata, data));
};
