import Konva from "konva";
import INLEDITOR from "@/index";
import { groupNames } from "@/element/group";
import { getCustomAttrs } from "@/util/customAttr";

export default (ie: INLEDITOR, e: KeyboardEvent) => {
  const Transformers = ie
    .getStage()
    .find("Transformer")[0] as Konva.Transformer;
  const nodes = Transformers?.getNodes() || [];
  for (let i of nodes) {
    const isThing = i.getParent().hasName(groupNames.thingGroup);
    const isThingText = i.getParent().hasName(groupNames.thingTextGroup);
    Transformers.destroy();
    if ((isThing && i.hasName("thingImage")) || isThingText) {
      i.getParent().remove();
    } else {
      // 删除关联关系
      removeRelevance(i, ie.getStage());
      i.remove();
    }
    ie.opt.onRemoveCb?.();
    ie.getStage().draw();
  }
};

const removeRelevance = (obj: any, stage: Konva.Stage) => {
  if (obj.className === "Arrow") {
    const lineInfo = getCustomAttrs(obj).lineInfo!;

    const rectOut = stage.findOne("#" + lineInfo.from);
    const rectIn = stage.findOne("#" + lineInfo.to);

    const outInfo = getCustomAttrs(rectOut).lineInfo;
    const inInfo = getCustomAttrs(rectIn).lineInfo;

    outInfo?.outLineIds?.splice(outInfo.outLineIds.indexOf(lineInfo.from!), 1);
    inInfo?.inLineIds?.splice(inInfo.inLineIds.indexOf(lineInfo.to!), 1);
  }
  if (
    obj.className === "Rect" ||
    obj.className === "Image" ||
    obj.name() === "thingImage"
  ) {
    const lineInfo = getCustomAttrs(obj).lineInfo;
    [...(lineInfo?.outLineIds || []), ...(lineInfo?.inLineIds || [])]?.forEach(
      (id: string) => {
        const line = stage.findOne("#" + id);
        removeRelevance(line, stage);
        line.remove();
      }
    );
  }
};
