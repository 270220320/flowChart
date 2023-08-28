import Konva from "konva";
import INLEDITOR from "@/index";
import { groupNames } from "@/element/group";
import { getCustomAttrs } from "@/util/customAttr";

export default (ie: INLEDITOR, e: KeyboardEvent) => {
  const Transformers = ie
    .getStage()
    .find("Transformer")[0] as Konva.Transformer;
  const nodes = Transformers?.getNodes() || [];
  for (let i = 0; i < nodes.length; i++) {
    const item = nodes[i];
    if (item.name() === "field") {
      continue;
    }
    const isThing = item.hasName("thingImage");
    const isThingText = item.getParent().hasName(groupNames.thingDefTextGroup);
    Transformers.destroy();
    removeRelevance(item, ie.getStage());
    if (isThing || isThingText) {
      item.getParent().remove();
    } else {
      // 删除关联关系
      item.remove();
    }
    ie.opt.onRemoveCb?.();
    ie.getStage().draw();
  }
};

export const removeRelevance = (obj: Konva.Node, stage: Konva.Stage) => {
  if (obj?.className === "Arrow" || obj?.className === "Line") {
    const line = obj.parent.findOne(".line");
    const lineInfo = getCustomAttrs(line).lineInfo!;

    const rectOut = stage.findOne("#" + lineInfo?.from);
    const rectIn = stage.findOne("#" + lineInfo?.to);

    const outInfo = getCustomAttrs(rectOut).lineInfo;
    const inInfo = getCustomAttrs(rectIn).lineInfo;
    outInfo?.outLineIds?.splice(outInfo?.outLineIds?.indexOf(line?.id()!), 1);
    inInfo?.inLineIds?.splice(inInfo?.inLineIds?.indexOf(line?.id()!), 1);
    if (obj.parent?.name() === "thingGroup") {
      obj.parent?.remove();
    }
  }
  if (
    obj?.className === "Rect" ||
    obj?.className === "Image" ||
    obj?.name() === "thingImage"
  ) {
    const lineInfo = getCustomAttrs(obj).lineInfo;
    [...(lineInfo?.outLineIds || []), ...(lineInfo?.inLineIds || [])]?.forEach(
      (id: string) => {
        const line = stage.findOne("#" + id);
        removeRelevance(line, stage);
        const isThing = line?.getParent()?.hasName(groupNames.thingGroup);
        if (isThing) {
          line?.parent?.remove();
        }
        line?.remove();
      }
    );
  }
};
