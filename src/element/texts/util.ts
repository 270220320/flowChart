import Konva from "konva";
import { getThingTextGroup } from "../group";
import { getCustomAttrs } from "@/util";
import { createThingTexts } from "../text";
import { thingTextInfo } from "@/data/cdata";
import INLEDITOR from "@/index";
import { changeValFuns } from "./funs";
import { changeTextLabel } from "@/util/element/text";

// 动态修改物模型的值
export const setTextVal = (
  stage: Konva.Stage,
  iu: string,
  propertyId: string,
  val: string,
  color?: string
) => {
  // 查找物模型
  let thingGroup: Konva.Group = stage.findOne(`#${iu}`);
  if (!thingGroup) {
    thingGroup = stage.findOne(`#line${iu}`);
  }
  // 筛选code
  thingGroup.children.forEach((textNode: Konva.Group) => {
    const info = getCustomAttrs(textNode);
    if (info?.propertyId && info.propertyId === propertyId) {
      info.thingTextInfo.v = val;
      changeValFuns[textNode.name()](textNode, info.thingTextInfo);
      if (color) {
        const valNode = textNode.children.find((ele) => ele.name() === "val");
        valNode.setAttrs({ fill: color });
      }
    }
  });
};

export const changeLabelState = (
  stage: Konva.Stage,
  iu: string,
  propertyId: string,
  state: boolean
) => {
  // 查找物模型
  const thingGroup = (stage.findOne(`#${iu}`) ||
    stage.findOne(`#line${iu}`)) as Konva.Group;
  if (!thingGroup) return;
  // 筛选code
  getThingTextGroup(thingGroup).forEach((textNode) => {
    const info = getCustomAttrs(textNode);
    if (info.propertyId && info.propertyId === propertyId) {
      const cdata = getCustomAttrs(textNode);
      // if (cdata.thingTextInfo.showLabel === state) return;
      cdata.thingTextInfo.showLabel = state;
      changeTextLabel(textNode, state);
    }
  });
};
// 重置文字元素
export const resetTextEle = (
  ie: INLEDITOR,
  iu: string,
  propertyId: string,
  thingTextInfo: thingTextInfo,
  type: string
) => {
  const stage = ie.getStage();
  // 查找物模型
  const thingGroup = (stage.findOne(`#${iu}`) ||
    stage.findOne(`#line${iu}`)) as Konva.Group;
  if (!thingGroup) return;
  const util = createThingTexts(ie, iu, ie.getTheme());
  thingGroup.children.forEach((oldTextGroup: Konva.Group) => {
    const info = getCustomAttrs(oldTextGroup);
    if (info?.propertyId && info.propertyId === propertyId) {
      info.thingTextInfo = thingTextInfo;
      const attr = oldTextGroup.attrs;
      if (attr.name === "thingDefTextGroup") {
        attr.x = attr.x + oldTextGroup.children[0].x();
        attr.y = attr.y + oldTextGroup.children[0].y();
        attr.scaleX = oldTextGroup.children[0].scaleX();
        attr.scaleY = oldTextGroup.children[0].scaleY();
      }
      attr.name = type;
      oldTextGroup.destroy();
      const textGroup = util.addText(info.thingTextInfo, attr.name, () => {
        if (!thingTextInfo.showLabel) {
          changeLabelState(stage, iu, propertyId, false);
        }
      });

      textGroup.setAttrs(attr);
    }
  });
};

enum SpecialCode {
  all = "allOfThem",
}
// 删除thing文字 allOfThem删除全部
export const removeTextEle = (
  ie: INLEDITOR,
  iu: string,
  ids: Array<string | SpecialCode.all>
) => {
  const stage = ie.getStage();
  // 查找物模型
  const thingGroup = (stage.findOne(`#${iu}`) ||
    stage.findOne(`#line${iu}`)) as Konva.Group;
  if (!thingGroup) return;
  // 筛选code
  for (let i of ids) {
    thingGroup.children
      .find((ele) => {
        const info = getCustomAttrs(ele).thingTextInfo;
        return info?.id === i;
      })
      ?.remove();
  }
  ie.saveHistory();
};
