import Konva from "konva";
import { CDATA, cData } from "src/data/cdata";

export const getCustomAttrs: (
  e: Konva.Stage | Konva.Group | Konva.Node
) => CDATA = (e) => {
  return e.getAttr("cdata") || cData;
};

export const setCustomAttrs = (
  e: Konva.Stage | Konva.Group | Konva.Node,
  data: CDATA
) => {
  const cdata = getCustomAttrs(e);
  e.setAttr("cdata", Object.assign(cData, cdata, data));
};

export const getLineInfo = (e: Konva.Line) => {
  const cd = getCustomAttrs(e);
  if (!cd.lineInfo) {
    setCustomAttrs(e, {
      lineInfo: {
        outLineIds: [],
        inLineIds: [],
      },
    });
    e.draw();
  }
  const { lineInfo } = getCustomAttrs(e);
  return lineInfo;
};
