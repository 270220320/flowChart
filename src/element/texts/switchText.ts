import theme, { Theme } from "../../config/theme";
import { thingTextInfo } from "@/data/cdata";
import Konva from "konva";
import { createThingTextGroup, groupNames } from "../group";
import { createText } from ".";
import { defaultRect } from "../rect";
import { getCustomAttrs } from "@/util";

const changeVal = (group, thingTextInfo) => {
  const {
    switchOpt: { checkedLabel, checkedValue, unCheckedLabel },
    v,
  } = thingTextInfo;
  const val = v === checkedLabel || v === checkedValue;
  console.log(thingTextInfo);
  if (val) {
    const btnRect = group.children.find((ele) => ele.name() === "btnRect");
    btnRect.setAttrs({ fill: "#1D33A2" });
    const btnText = group.children.find((ele) => ele.name() === "btnText");
    btnText.setAttrs({ x: btnRect.x() + 5, text: checkedLabel });
    const checkRect = group.children.find((ele) => ele.name() === "checkRect");
    checkRect.setAttrs({ x: btnText.x() + btnText.width() + 5 });
  } else {
    const btnRect = group.children.find((ele) => ele.name() === "btnRect");
    btnRect.setAttrs({ fill: "grey" });
    const checkRect = group.children.find((ele) => ele.name() === "checkRect");
    checkRect.setAttrs({ x: btnRect.x() + 5 });
    const btnText = group.children.find((ele) => ele.name() === "btnText");
    btnText.setAttrs({
      x: checkRect.x() + checkRect.width() + 5,
      text: unCheckedLabel,
    });
  }
};

export default {
  add: (
    themeType: Theme,
    data: thingTextInfo,
    position: { x: number; y: number },
    group?: Konva.Group
  ) => {
    const { label, v, unit, id } = data;
    group =
      group ||
      createThingTextGroup(data, groupNames.thingSwitchGroup, position);
    const t = theme[themeType];
    const { advanced } = t.thingText;
    const labelText = createText({
      fill: advanced.label.fill,
      fontSize: advanced.label.size,
      text: label + "：",
      draggable: false,
      height: advanced.val.rectHeight,
      name: "label",
    });
    const btnText = createText({
      fill: "white",
      fontSize: advanced.val.size,
      text: data.switchOpt.checkedLabel,
      draggable: false,
      x: labelText.width() + 5,
      y: 1,
      align: "center",
      height: advanced.val.rectHeight,
      name: "btnText",
    });
    const checkRect = defaultRect({
      fill: "white",
      // stroke: advanced.val.rectStroke,
      strokeWidth: 0,
      height: advanced.val.rectHeight - 8,
      width: advanced.val.rectHeight - 8,
      draggable: false,
      x: btnText.x() + btnText.width() + 5,
      y: 4,
      cornerRadius: 3,
      name: "checkRect",
    });
    const btnRect = defaultRect({
      fill: "#1D33A2",
      // stroke: advanced.val.rectStroke,
      strokeWidth: 0,
      height: advanced.val.rectHeight,
      width: btnText.width() + checkRect.width() + 15,
      draggable: false,
      x: labelText.width(),
      cornerRadius: 3,
      name: "btnRect",
    });
    group.add(labelText, btnText, btnRect, checkRect);
    btnText.moveToTop();
    changeVal(group, data);
    return group;
  },
  changeVal,
};