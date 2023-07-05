import theme, { Theme } from "../../config/theme";
import { thingTextInfo } from "@/data/cdata";
import Konva from "konva";
import { createThingTextGroup } from "../group";
import { createText } from ".";
import { defaultRect } from "../rect";

// 创建复杂的thing文字
export default {
  add: (
    themeType: Theme,
    data: thingTextInfo,
    position: { x: number; y: number },
    group?: Konva.Group
  ) => {
    const { label, v, unit, id } = data;
    group = group || createThingTextGroup(data, "thingTextGroup", position);
    const t = theme[themeType];
    const { advanced } = t.thingText;
    // lebel
    const labelText = createText({
      fill: advanced.label.fill,
      fontSize: advanced.label.size,
      text: label + "：",
      draggable: false,
      height: advanced.val.rectHeight,
      name: "label",
    });
    // 值
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

    // 单位
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
    // 输入文本
    const inputText = createText({
      fill: "black",
      fontSize: advanced.val.size,
      text: "1.1",
      draggable: false,
      x: unitText.x() + unitText.width() + 10,
      align: "center",
      height: advanced.val.rectHeight,
      name: "input",
    });
    // 输入框
    const inputRect = defaultRect({
      fill: "white",
      stroke: "grey",
      strokeWidth: 1,
      height: advanced.val.rectHeight,
      width: 50,
      draggable: false,
      x: unitText.x() + unitText.width() + 5,
      cornerRadius: 3,
      name: "inputBg",
    });
    // 按钮字
    const btnText = createText({
      fill: advanced.val.fill,
      fontSize: advanced.val.size,
      text: "下发",
      draggable: false,
      x: inputRect.x() + inputRect.width() + 10,
      align: "center",
      height: advanced.val.rectHeight,
      name: "btn",
    });
    // 按钮背景
    const btnRect = defaultRect({
      fill: advanced.val.rectFill,
      stroke: advanced.val.rectStroke,
      strokeWidth: 1,
      height: advanced.val.rectHeight,
      width: btnText.width() + 10,
      draggable: false,
      x: inputRect.x() + inputRect.width() + 5,
      cornerRadius: 3,
      name: "btnBg",
    });
    group.add(
      labelText,
      valtext,
      unitText,
      inputRect,
      inputText,
      btnText,
      btnRect
    );
    btnText.moveUp();
    return group;
  },
};
