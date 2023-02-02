import Konva from "konva";
import { TextConfig } from "konva/lib/shapes/Text";
import { defaultRect } from "src/config/rect.config";
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

// c创建默认的thing文字
interface DefaultText {
  text: string;
  code: string;
  x?: number;
  y?: number;
}
export const createThingDefaultText = (themeType: Theme, data: DefaultText) => {
  const t = theme[themeType];
  const { x, y, text, code } = data;
  return createText({
    x: x || 0,
    y: y || 0,
    fill: t.thingTitle.val.fill,
    fontSize: t.thingTitle.val.size,
    text: text,
    align: "center",
    code,
    height: t.showVal.val.rectHeight,
    name: "createThingDefaultText",
  });
};
// 设置默认 thing 文字的主题色
export const setThingDefaultTextTheme = (ea: Konva.Text, themeType: Theme) => {
  const t = theme[themeType];
  ea.setAttrs({
    fill: t.thingTitle.val.fill,
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
  const label = createText({
    fill: t.showVal.label.fill,
    fontSize: t.showVal.label.size,
    text: labelv,
    draggable: false,
    height: t.showVal.val.rectHeight,
    name: "label",
  });

  const valRect = defaultRect({
    fill: t.showVal.val.rectFill,
    stroke: t.showVal.val.rectStroke,
    strokeWidth: 1,
    height: t.showVal.val.rectHeight,
    width: t.showVal.val.rectWidth,
    draggable: false,
    x: label.width(),
    cornerRadius: 3,
    name: "rect",
  });
  const val = createText({
    fill: t.showVal.val.fill,
    fontSize: t.showVal.val.size,
    text: value,
    draggable: false,
    x: label.width(),
    width: valRect.width(),
    align: "center",
    height: t.showVal.val.rectHeight,
    name: "val",
  });
  const unit = createText({
    fill: t.showVal.unit.fill,
    fontSize: t.showVal.unit.size,
    opacity: t.showVal.unit.opacity,
    text: unitval,
    x: valRect.attrs.x + valRect.width() + 5,
    draggable: false,
    height: t.showVal.val.rectHeight,
    name: "unit",
  });

  group.add(valRect, label, val, unit);
  return group;
};

// 查询复杂的thing文字
export const getThingAdvancedText = (parent: Parent) => {};

// 修改thing 文字的主题
export const changeThingTextTheme = (themeType: Theme) => {};
