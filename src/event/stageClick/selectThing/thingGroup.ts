import { getCustomAttrs } from "@/util/customAttr";
import { KonvaEventObject } from "konva/lib/Node";
import { onSelectCallBackFun } from "..";

export default (cb: onSelectCallBackFun, e: KonvaEventObject<MouseEvent>) => {
  // thinggroup
  let parent = e.target.getParent();
  const data1 = getCustomAttrs(parent);
  const codeArr = [];
  const idArr = [];
  parent.find("Group").forEach((item) => {
    const data = getCustomAttrs(item);
    if (data.propertyId) {
      codeArr.push(data.propertyCode);
      idArr.push(data.propertyId);
    }
  });
  cb(
    "thing",
    { parent, target: e.target },
    { iu: data1.thing!.iu, codes: codeArr, ids: idArr }
  );
};
