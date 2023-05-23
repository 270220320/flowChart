import { getCustomAttrs } from "@/util/customAttr";
import { KonvaEventObject } from "konva/lib/Node";
import { getIus, onSelectCallBackFun } from "..";
import { getParentThingGroup } from "@/util/element";



export default (cb: onSelectCallBackFun, e: KonvaEventObject<MouseEvent>) => {
  let parent = e.target.getParent();
  const thingImgParent = getParentThingGroup(e.target);
  const thingImgData = getCustomAttrs(thingImgParent);
  const codeArr = [];
  const idArr = [];
  thingImgParent.find("Group").forEach((item) => {
    const data = getCustomAttrs(item);
    if (data.propertyId) {
      codeArr.push(data.propertyCode);
      idArr.push(data.propertyId);
    }
  });
  cb(
    "thing",
    { parent: thingImgParent as any, target: parent },
    {
      iu: thingImgData.thing?.iu,
      codes: codeArr,
      ids: idArr,
    }
  );
};
