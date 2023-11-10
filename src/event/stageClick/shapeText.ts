import { KonvaEventObject } from "konva/lib/Node";
import { onSelectCallBackFun } from ".";

export default (cb: onSelectCallBackFun, e: KonvaEventObject<MouseEvent>) => {
  let parent = e.target.getParent();
  if (parent.getClassName() === "Layer" && cb) {
    cb(
      e.target.getClassName(),
      {
        target: e.target,
        parent,
      },
      {
        attrs: e.target.getAttrs(),
      }
    );
  }
};
