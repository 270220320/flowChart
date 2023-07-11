import theme, { Theme } from "../../config/theme";
import { thingTextInfo } from "@/data/cdata";
import Konva from "konva";
import { createThingTextGroup, groupNames } from "../group";
import { createText } from ".";
import { defaultRect } from "../rect";

const obj = {
  add: (
    themeType: Theme,
    data: thingTextInfo,
    position: { x: number; y: number },
    group?: Konva.Group
  ) => {
    const { label, v, unit, id } = data;
    group =
      group || createThingTextGroup(data, groupNames.thingInputGroup, position);
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
      text: "",
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
      fill: "white",
      fontSize: advanced.val.size,
      text: data.btns[0],
      draggable: false,
      x: inputRect.x() + inputRect.width() + 10,
      y: 1,
      align: "center",
      height: advanced.val.rectHeight,
      name: "btn",
    });
    // 按钮背景
    const btnRect = defaultRect({
      fill: "#1D33A2",
      stroke: "#1D33A2",
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
  changeVal: (group, val) => {
    const valNode = group.children.find((ele) => ele.name() === "val");
    valNode.setAttrs({ text: val });
  },
  focus: (item) => {
    const input = item.children.find((ele) => ele.name() === "input");
    const cursor = new Konva.Line({
      points: [
        input.x() + input.width() + 2,
        input.y() + 2,
        input.x() + input.width() + 2,
        input.y() + input.height() - 4,
      ],
      stroke: "black",
      strokeWidth: 1,
      name: "cursor",
    });
    cursor.attrs.interval = setInterval(() => {
      cursor.visible(!cursor.visible());
    }, 500);
    item.add(cursor);
  },
  blur: (item) => {
    const cursor = item.children.find((ele) => ele.name() === "cursor");
    clearInterval(cursor.attrs.interval);
    cursor?.remove();
  },
  keyIn: (e, item: Konva.Group) => {
    const input = item.children.find((ele) => ele.name() === "input");
    const cursor = item.children.find((ele) => ele.name() === "cursor");
    let val = input.attrs.text;
    if (e.key.length === 1) {
      input.setAttrs({ text: val + e.key });
    } else if (e.key === "Backspace") {
      if (val) {
        val = val.slice(0, val.length - 1);
        input.setAttrs({ text: val });
      }
    }
    cursor.setAttrs({
      points: [
        input.x() + input.width() + 2,
        input.y() + 2,
        input.x() + input.width() + 2,
        input.y() + input.height() - 4,
      ],
    });
  },
};
// 创建复杂的thing文字
export default obj;
