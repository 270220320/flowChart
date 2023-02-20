import { KonvaEventObject } from "konva/lib/Node";
import { onSelectCallBackFun } from ".";

export default (cb: onSelectCallBackFun, e: KonvaEventObject<MouseEvent>) => {
  cb("stage", { target: e.target });
};
