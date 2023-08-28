import Konva from "konva";
import { getCustomAttrs } from "../customAttr";

export const setLineWidth = (
  line: Konva.Node,
  size: number,
  basicDash?: number[]
) => {
  const coreLine = line.parent.findOne(".line");
  const info = getCustomAttrs(coreLine);

  // 管道
  if (info.lineInfo.type.toLocaleLowerCase().indexOf("dotted") === -1) {
    const borderOuter = line.parent.findOne(".borderOuter");
    borderOuter.setAttrs({ strokeWidth: size });
    const borderInner = line.parent.findOne(".borderInner");
    borderInner.setAttrs({ strokeWidth: size * 0.75 });
    coreLine.setAttrs({ strokeWidth: size / 4 });
    info.lineInfo.width = size;
    const proportion = size / 8;
    const dash = basicDash || [8];
    coreLine.setAttrs({ dash: dash.map((ele) => ele * proportion) });
  } else {
    line.setAttrs({ strokeWidth: size });
    const proportion = size / 4;
    if (basicDash) {
      line.setAttrs({ dash: basicDash.map((ele) => ele * proportion) });
    }
  }
};
export const getLineWidth = (line: Konva.Node) => {
  const coreLine = line.parent.findOne(".line");
  const info = getCustomAttrs(coreLine);
  // 管道
  if (info.lineInfo.type.toLocaleLowerCase().indexOf("dotted") === -1) {
    const borderOuter = line.parent.findOne(".borderOuter");
    return borderOuter.attrs.strokeWidth;
  } else {
    return line.attrs.strokeWidth;
  }
};
