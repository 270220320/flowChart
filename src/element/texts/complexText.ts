import theme, { Theme } from "../../config/theme";
import { thingTextInfo } from "@/data/cdata";
import Konva from "konva";
import { createThingTextGroup, groupNames } from "../group";
import { createText } from ".";

const obj = {
  changeVal: (group, info) => {
    const value = info.v;
    let val, unit;
    group.children.forEach((ele) => {
      if (ele.name() === "val") {
        val = ele;
      } else if (ele.name() === "unit") {
        unit = ele;
      }
    });

    val.setAttrs({ text: value });
    unit.setAttrs({ x: val.x() + val.width() + 5 });
    // group.getLayer().batchDraw();
  },
};

// 创建复杂的thing文字
export const createThingAdvancedText = (
  themeType: Theme,
  data: thingTextInfo,
  position: { x: number; y: number },
  group?: Konva.Group
) => {
  const { label, v, unit, id } = data;
  group =
    group || createThingTextGroup(data, groupNames.thingTextGroup, position);
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
  const valtext = createText(
    {
      fill: advanced.val.fill,
      fontSize: advanced.val.size,
      text: v,
      draggable: false,
      x: labelText.width() + 5,
      align: "center",
      height: advanced.val.rectHeight,
      name: "val",
    },
    id
  );

  const unitText = createText({
    fill: advanced.unit.fill,
    fontSize: advanced.unit.size,
    opacity: advanced.unit.opacity,
    text: unit,
    x: valtext.x() + valtext.width() + 5,
    draggable: false,
    height: advanced.val.rectHeight,
    name: "unit",
  });
  if (data.showLabel) {
    group.add(labelText, valtext, unitText);
  } else {
    group.add(valtext, unitText);
  }

  return group;
};

export default obj;
