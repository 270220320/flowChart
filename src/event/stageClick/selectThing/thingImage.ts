import { getCustomAttrs } from "@/util/customAttr";
import { KonvaEventObject } from "konva/lib/Node";
import { getIus, onSelectCallBackFun } from "..";

export default (cb: onSelectCallBackFun, e: KonvaEventObject<MouseEvent>) => {
  let parent = e.target.getParent();
  const thingImgParent =
    e.target.getClassName() === "Image" ? parent : parent.getParent();
  const thingImgData = getCustomAttrs(thingImgParent);
  const codeArr = [];
  const idArr = [];
  thingImgParent.find("Group").forEach((item) => {
    const data = getCustomAttrs(item);
    if (data.propertyCode) {
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
