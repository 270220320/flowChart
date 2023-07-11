import Konva from "konva";
import { getThingTextGroup } from "../group";
import { getCustomAttrs } from "@/util";
import { createThingTexts, setThingTextVal } from "../text";
import { thingTextInfo } from "@/data/cdata";
import INLEDITOR from "@/index";

// 动态修改物模型的值
export const setTextVal = (
  stage: Konva.Stage,
  iu: string,
  propertyId: string,
  val: string
) => {
  // 查找物模型
  const thingGroup = (stage.findOne(`#${iu}`) ||
    stage.findOne(`#line${iu}`)) as Konva.Group;
  if (!thingGroup) return;
  // 筛选code
  getThingTextGroup(thingGroup).forEach((textNode) => {
    const info = getCustomAttrs(textNode);
    if (info.propertyId && info.propertyId === propertyId) {
      setThingTextVal(textNode, val);
    }
  });
};

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
  getThingTextGroup(thingGroup).forEach((textNode) => {
    const info = getCustomAttrs(textNode);
    if (info.propertyId && info.propertyId === propertyId) {
      info.thingTextInfo = thingTextInfo;
      textNode.name(type);
      const attr = textNode.attrs;
      textNode.remove();
      const textGroup = util.addText(info.thingTextInfo, attr.name);
      textGroup.setAttrs(attr);
    }
  });
};

enum SpecialCode {
  all = "allOfThem",
}
// 删除thing文字 allOfThem删除全部
export const removeTextEle = (
  stage: Konva.Stage,
  iu: string,
  ids: Array<string | SpecialCode.all>
) => {
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
};
