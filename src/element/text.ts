import Konva from "konva";
import { TextConfig } from "konva/lib/shapes/Text";
import { defaultRect } from "../element/rect";
import theme, { Theme } from "../config/theme";
import { Child, Parent, createThingTextGroup, groupNames } from "./group";
import { thingTextInfo } from "../data/cdata";
import { THINGTEXT } from "../data/dropData";
import layer from "../util/layer";

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
  data: thingTextInfo,
  position: { x: number; y: number }
) => {
  const t = theme[themeType];
  const { v, code } = data;
  const { x, y } = position;
  const group = createThingTextGroup(data, "thingDefTextGroup", position);
  const textEl = createText({
    x: x || 0,
    y: y || 0,
    fill: t.thingText.def.val.fill,
    fontSize: t.thingText.def.val.size,
    text: v,
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

// 修改thing 文字的val
export const setThingTextVal = (e: Konva.Group, val: string) => {
  const text = e.findOne(".val");

  if (text) {
    // 设置value
    text.setAttrs({
      text: val,
    });
  }

  // 设置thing属性值
};

// 查询默认 thing文字
export const getThingDefaultTexts: (parent: Parent) => Array<Child> = (e) => {
  return e.find(`.${groupNames.thingDefTextGroup}`);
};

// 创建复杂的thing文字
export const createThingAdvancedText = (
  themeType: Theme,
  data: thingTextInfo,
  position: { x: number; y: number }
) => {
  const { label, v, unit } = data;
  const group = createThingTextGroup(data, "thingTextGroup", position);
  const t = theme[themeType];
  const { advanced } = t.thingText;
  const labelText = createText({
    fill: advanced.label.fill,
    fontSize: advanced.label.size,
    text: label,
    draggable: false,
    height: advanced.val.rectHeight,
    name: "label",
  });
  const valtext = createText({
    fill: advanced.val.fill,
    fontSize: advanced.val.size,
    text: v,
    draggable: false,
    x: labelText.width() + 5,
    align: "center",
    height: advanced.val.rectHeight,
    name: "val",
  });
  const valRect = defaultRect({
    fill: advanced.val.rectFill,
    stroke: advanced.val.rectStroke,
    strokeWidth: 1,
    height: advanced.val.rectHeight,
    width: valtext.width() + 10,
    draggable: false,
    x: labelText.width(),
    cornerRadius: 3,
    name: "rect",
  });

  const unitText = createText({
    fill: advanced.unit.fill,
    fontSize: advanced.unit.size,
    opacity: advanced.unit.opacity,
    text: unit,
    x: valRect.attrs.x + valRect.width() + 5,
    draggable: false,
    height: advanced.val.rectHeight,
    name: "unit",
  });

  group.add(valRect, labelText, valtext, unitText);
  return group;
};

// 根据 thing id 插入文字
export const createThingTextByThingId = (
  stage: Konva.Stage,
  iu: string,
  texts: THINGTEXT,
  themeType: Theme
) => {
  const group = layer(stage, "thing").findOne(`#${iu}`) as Konva.Group;
  createThingTextByGroup(group, texts, themeType);
};
// 根据 组插入文字
export const createThingTextByGroup = (
  group: Konva.Group,
  texts: THINGTEXT,
  themeType: Theme
) => {
  for (let i of texts) {
    if (i.type === "thingDefTextGroup") {
      group.add(createThingDefaultText(themeType, i.info, i.position));
    } else {
      group.add(createThingAdvancedText(themeType, i.info, i.position));
    }
  }
};

// 查询复杂的thing文字
export const getThingAdvancedText = (parent: Parent) => {};

// 修改thing 文字的主题
export const changeThingTextTheme = (themeType: Theme) => {};

export const createThingText = (
  stage: Konva.Stage,
  iu: string,
  themeType: Theme
) => {
  const thingGroup = stage.findOne(`#${iu}`) as Konva.Group;
  if (!thingGroup) return;
  const thing = thingGroup.findOne("Image") as Konva.Image;

  if (!thing) return console.warn(`查询错误:${iu}`);
  return {
    def: (text: string, code: string) => {
      const textShape = createThingDefaultText(
        themeType,
        {
          v: text,
          code,
        },
        { x: 0, y: 0 }
      );
      thingGroup.add(textShape);
      textShape.setAttrs({
        x: thing.attrs.x,
        y: thing.attrs.y + thing.height(),
        draggable: true,
      });
    },
    advanced: (data: createThingTextGroupData) => {
      const { labelv, value, unitval, code } = data;
      const group = createThingAdvancedText(
        themeType,
        {
          label: labelv,
          v: value,
          unit: unitval,
          code,
        },
        {
          x: thing.attrs.x,
          y: thing.attrs.y + thing.height(),
        }
      );
      thingGroup.add(group);
    },
  };
};
