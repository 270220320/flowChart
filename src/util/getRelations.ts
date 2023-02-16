import Konva from "konva";
import { getCustomAttrs, getLineInfo } from "./customAttr";

export const getRelations = (stage: Konva.Stage) => {
  return stage.find("Arrow").map((ele: any) => {
    const lineInfo = getLineInfo(ele);
    return {
      instanceIdUp: stage.findOne("#" + lineInfo.from).parent.id(),
      instanceIdDown: stage.findOne("#" + lineInfo.to).parent.id(),
    };
  });
};

export const getRelation = (line, stage: Konva.Stage) => {
  const lineInfo = getLineInfo(line);
  return {
    instanceIdUp: stage.findOne("#" + lineInfo.from).parent.id(),
    instanceIdDown: stage.findOne("#" + lineInfo.to).parent.id(),
  };
};
