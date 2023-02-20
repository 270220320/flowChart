import { getCustomAttrs } from "@/util/customAttr";
import { KonvaEventObject } from "konva/lib/Node";
import { getIus, onSelectCallBackFun } from "..";

export default (cb: onSelectCallBackFun, e: KonvaEventObject<MouseEvent>) => {
  let parent = e.target.getParent();
  const data1 = getCustomAttrs(parent);
  const code1 = getIus(parent);
  cb(
    "thing",
    { parent, target: e.target },
    { iu: data1.thing!.iu, code: code1 }
  );
};
