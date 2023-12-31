import Konva from "konva";
import { getCustomAttrs, getLineInfo, setCustomAttrs } from "../customAttr";
import { lineState } from "../../config";
import layer from "src/util/layer";
import { LineTheme, gridLineTheme } from "@/config/line";
import computedXY from "../computedXY";
import { getLineMiddle } from "./lineLogic";
import INLEDITOR from "@/index";

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

export const addLineText = (
  stage: Konva.Stage,
  line: Konva.Arrow,
  text: string
) => {
  const point: { x: number; y: number } = getLineMiddle(line);
  const lineText = new Konva.Text({
    ...point,
    text,
    fontSize: 30,
    fill: "green",
    name: "lineText",
  });
  setCustomAttrs(lineText, { lineId: line.id() });
  const lay = layer(stage, "line");
  lay.add(lineText);
};

export const changeLineTheme = (ie: INLEDITOR, theme: string) => {
  const grids = ie.getStage().find(".grid");
  grids.forEach((line: Konva.Arrow) => {
    line.setAttrs({
      stroke: gridLineTheme[ie.getTheme()].stroke,
    });
  });
};

// 连接到新块修改关系
export const connectNewRect = (
  line: Konva.Arrow,
  controlIndex: number,
  newParent: Konva.Node,
  point: {
    x: number;
    y: number;
  },
  stage: Konva.Stage
) => {
  const lineInfo = getCustomAttrs(line).lineInfo!;
  const newInfo = getLineInfo(newParent);
  const xy = computedXY(
    stage,
    newParent.absolutePosition().x,
    newParent.absolutePosition().y
  );
  if (controlIndex === 0) {
    const oldRect = stage.findOne("#" + lineInfo.from);
    const oldRectInfo = getCustomAttrs(oldRect).lineInfo;
    oldRectInfo?.outLineIds?.splice(
      oldRectInfo.outLineIds.indexOf(line.id()),
      1
    );
    lineInfo.from = newParent.id();
    lineInfo.fromExcursionX = point.x - xy.x;
    lineInfo.fromExcursionY = point.y - xy.y;
    newInfo?.outLineIds?.push(line.id());
  } else {
    const oldRect = stage.findOne("#" + lineInfo.to);
    const oldRectInfo = getCustomAttrs(oldRect).lineInfo;
    oldRectInfo?.inLineIds?.splice(oldRectInfo.inLineIds.indexOf(line.id()), 1);
    lineInfo.to = newParent.id();
    lineInfo.toExcursionX = point.x - xy.x;
    lineInfo.toExcursionY = point.y - xy.y;
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
