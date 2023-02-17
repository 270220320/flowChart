import Konva from "konva";
import { getCustomAttrs, getLineInfo } from "../customAttr";
import { lineState } from "../../config";
import layer from "src/util/layer";
import { LineTheme } from "@/config/line";

export const updateLineColor = (
  key: string,
  line: Konva.Arrow,
  theme: string
) => {
  const info = getLineInfo(line);
  info.state = key;
  line.setAttrs({
    stroke: lineState[theme][key],
    fill: lineState[theme][key],
  });
};

export const changeLineTheme = (stage: Konva.Stage, theme: string) => {
  const lay = layer(stage, "line");
  lay.children.forEach((ele: Konva.Arrow) => {
    ele.setAttrs(LineTheme[theme]);
  });
};

// 连接到新块修改关系
export const connectNewRect = (
  line: Konva.Arrow,
  controlIndex: number,
  newParent: Konva.Shape | Konva.Group,
  point: {
    x: number;
    y: number;
  },
  stage: Konva.Stage
) => {
  const lineInfo = getCustomAttrs(line).lineInfo!;
  const newInfo = getLineInfo(newParent);
  if (controlIndex === 0) {
    const oldRect = stage.findOne("#" + lineInfo.from);
    const oldRectInfo = getCustomAttrs(oldRect).lineInfo;
    oldRectInfo?.outLineIds?.splice(
      oldRectInfo.outLineIds.indexOf(line.id()),
      1
    );
    lineInfo.from = newParent.id();
    lineInfo.fromExcursionX = point.x - newParent.attrs.x;
    lineInfo.fromExcursionY = point.y - newParent.attrs.y;
    newInfo?.outLineIds?.push(line.id());
  } else {
    const oldRect = stage.findOne("#" + lineInfo.to);
    const oldRectInfo = getCustomAttrs(oldRect).lineInfo;
    oldRectInfo?.inLineIds?.splice(oldRectInfo.inLineIds.indexOf(line.id()), 1);
    lineInfo.to = newParent.id();
    lineInfo.toExcursionX = point.x - newParent.attrs.x;
    lineInfo.toExcursionY = point.y - newParent.attrs.y;
    newInfo?.inLineIds?.push(line.id());
  }
};

// 根据konva点转换正常点
export const getUsePoint: (
  p: Array<number>,
  i?: number
) => Array<{
  x: number;
  y: number;
}> = (p, i) => {
  const l = p.length;
  if (l % 2 !== 0) {
    console.warn("非原始点");
    return [];
  }
  const usePoint: Array<{
    x: number;
    y: number;
  }> = [];
  for (let i = 0; i < l / 2; i++) {
    const p1 = { x: p[i * 2], y: p[i * 2 + 1], i };
    usePoint.push(p1);
  }
  if (i === 0 || i) {
    return [usePoint[i]];
  }
  return usePoint;
};

// 根据正常点转konva点
export const getUsePointUn: (
  p: Array<{
    x: number;
    y: number;
  }>
) => Array<number> = (p) => {
  const arr: Array<number> = [];
  for (let i of p) {
    arr.push(i.x, i.y);
  }
  return arr;
};
