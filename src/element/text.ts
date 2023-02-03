import Konva from "konva";
import { TextConfig } from "konva/lib/shapes/Text";
import { defaultRect } from "src/element/rect";
import theme, { Theme } from "src/config/theme";
import {
  Child,
  Parent,
  createThingTextGroup,
  createThingTextGroupData,
} from "./group";

export const createText = (config: TextConfig) =>
  new Konva.Text({
    fontFamily: "Calibri",
    fill: "black",
    fontSize: 14,
    verticalAlign: "middle",
    ...config,
  });

export const createThingDefaultText = (
  themeType: Theme,
  data: createThingTextGroupData
) => {
  const t = theme[themeType];
  const { x, y, value, code } = data;
  const group = createThingTextGroup(data, "thingDefTextGroup");
  const textEl = createText({
    x: x || 0,
    y: y || 0,
    fill: t.thingText.def.val.fill,
    fontSize: t.thingText.def.val.size,
    text: value,
    align: "center",
    code,
    height: t.thingText.advanced.val.rectHeight,
    name: "val",
  });
  group.add(textEl);
  return group;
};
// 设置默认 thing 文字的主题色
export const setThingDefaultTextTheme = (ea: Konva.Text, themeType: Theme) => {
  const t = theme[themeType];
  ea.setAttrs({
    fill: t.thingText.def.val.fill,
  });
};

// 修改默认 thing 文字的val
export const setThingDefaultTextVal = (e: Konva.Text, val: string) => {
  e.setAttrs({
    text: val,
  });
};

// 查询默认 thing文字
export const getThingDefaultTexts: (parent: Parent) => Array<Child> = (e) => {
  return e.find(".createThingDefaultText");
};

// 创建复杂的thing文字
export const createThingAdvancedText = (
  themeType: Theme,
  data: createThingTextGroupData
) => {
  const { labelv, value, unitval } = data;
  const group = createThingTextGroup(data, "thingTextGroup");
  const t = theme[themeType];
  const { val, unit, label } = t.thingText.advanced;
  const labelText = createText({
    fill: label.fill,
    fontSize: label.size,
    text: labelv,
    draggable: false,
    height: val.rectHeight,
    name: "label",
  });
  const valtext = createText({
    fill: val.fill,
    fontSize: val.size,
    text: value,
    draggable: false,
    x: labelText.width() + 5,
    align: "center",
    height: val.rectHeight,
    name: "val",
  });
  const valRect = defaultRect({
    fill: val.rectFill,
    stroke: val.rectStroke,
    strokeWidth: 1,
    height: val.rectHeight,
    width: valtext.width() + 10,
    draggable: false,
    x: labelText.width(),
    cornerRadius: 3,
    name: "rect",
  });

  const unitText = createText({
    fill: unit.fill,
    fontSize: unit.size,
    opacity: unit.opacity,
    text: unitval,
    x: valRect.attrs.x + valRect.width() + 5,
    draggable: false,
    height: val.rectHeight,
    name: "unit",
  });

  group.add(valRect, labelText, valtext, unitText);
  return group;
};

// 查询复杂的thing文字
export const getThingAdvancedText = (parent: Parent) => {};

// 修改thing 文字的主题
export const changeThingTextTheme = (themeType: Theme) => {};
