import Konva from "konva";
import { getCustomAttrs } from "../customAttr";

export const setLineWidth = (line: Konva.Node, size: number) => {
  const coreLine = line.parent.findOne(".line");
  const info = getCustomAttrs(coreLine);
  // 管道
  if (info.lineInfo.type.toLocaleLowerCase().indexOf("dotted") === -1) {
    const borderOuter = line.parent.findOne(".borderOuter");
    borderOuter.setAttrs({ strokeWidth: size });
    const borderInner = line.parent.findOne(".borderInner");
    borderInner.setAttrs({ strokeWidth: size / 2 });
    coreLine.setAttrs({ strokeWidth: size / 4 });
  } else {
    line.setAttrs({ strokeWidth: size });
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
