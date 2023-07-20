import theme, { Theme } from "../../config/theme";
import { thingTextInfo } from "@/data/cdata";
import Konva from "konva";
import { createThingTextGroup, groupNames } from "../group";
import { createText } from ".";
import { defaultRect } from "../rect";

const changeVal = (group, thingTextInfo) => {
  const {
    switchOpt: { checkedLabel, checkedValue, unCheckedLabel },
    v,
  } = thingTextInfo;
  const val = v === checkedLabel || v === checkedValue;
  let btnRect, btnText, checkRect;
  group.children.forEach((ele) => {
    if (ele.name() === "btnRect") {
      btnRect = ele;
    } else if (ele.name() === "btnText") {
      btnText = ele;
    } else if (ele.name() === "checkRect") {
      checkRect = ele;
    }
  });

  if (val) {
    btnText.setAttrs({ x: btnRect.x() + 5, text: checkedLabel });
    checkRect.setAttrs({ x: btnText.x() + btnText.width() + 5 });
    btnRect.setAttrs({
      fill: "#1D33A2",
      width: btnText.width() + checkRect.width() + 15,
    });
  } else {
    checkRect.setAttrs({ x: btnRect.x() + 5 });
    btnText.setAttrs({
      x: checkRect.x() + checkRect.width() + 5,
      text: unCheckedLabel,
    });
    btnRect.setAttrs({
      fill: "#99A0B6",
      width: btnText.width() + checkRect.width() + 15,
    });
  }
  // group.getLayer().batchDraw();
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
