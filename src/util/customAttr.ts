import Konva from "konva";
import _ from "lodash";
import { CDATA } from "src/data/cdata";

export const getCustomAttrs: (
  e: Konva.Stage | Konva.Group | Konva.Node
) => CDATA = (e) => {
  return e.getAttr("cdata") || {};
};

export const setCustomAttrs = (
  e: Konva.Stage | Konva.Group | Konva.Node,
  data: CDATA
) => {
  const cdata = getCustomAttrs(e);
  e.setAttr("cdata", _.cloneDeep(Object.assign(cdata, data)));
};

export const getLineInfo = (e: Konva.Node) => {
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
