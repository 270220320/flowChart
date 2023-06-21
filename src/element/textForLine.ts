import Konva from "konva";
import { TextConfig } from "konva/lib/shapes/Text";
import { defaultRect } from "../element/rect";
import theme, { Theme } from "../config/theme";
import {
  Child,
  Parent,
  createThingGroup,
  createThingTextGroup,
  groupNames,
} from "./group";
import { thingTextInfo } from "../data/cdata";
import { THINGTEXT } from "../data/dropData";
import layer from "../util/layer";
import { getCustomAttrs, setCustomAttrs } from "../util/customAttr";
import { toSelect } from "@/event/selectItem";
import { Group } from "konva/lib/Group";
import computedXY from "@/util/computedXY";
import { getUsePoint } from "@/util/line/line";

export const createText = (config: TextConfig, id?: string) =>
  new Konva.Text({
    fontFamily: "Calibri",
    fill: "black",
    fontSize: 14,
    verticalAlign: "middle",
    id,
    ...config,
  });

export const createThingDefaultText = (
  themeType: Theme,
  data: thingTextInfo,
  position: { x: number; y: number },
  group?: Konva.Group
) => {
  const t = theme[themeType];

  const { v, unit, id } = data;
  group = group || createThingTextGroup(data, "thingDefTextGroup", position);
  const textEl = createText(
    {
      fill: t.thingText.def.val.fill,
      fontSize: t.thingText.def.val.size,
      text: v + (unit || ""),
      align: "center",
      height: t.thingText.advanced.val.rectHeight,
      name: "val",
    },
    id
  );
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
  const rect = e.findOne(".rect");
  const unit = e.findOne(".unit");
  if (text) {
    if (e.name() === "thingDefTextGroup") {
      const info = getCustomAttrs(e).thingTextInfo;
      text.setAttrs({
        text: val + (info.unit || ""),
      });
    } else {
      // 设置value
      text.setAttrs({
        text: val,
      });

      if (rect) {
        rect.setAttrs({
          width: text.width() + 10,
        });
      }
      if (unit) {
        unit.setAttrs({
          x: rect.attrs.x + rect.width() + 5,
        });
      }
    }
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
  position: { x: number; y: number },
  group?: Konva.Group
) => {
  const { label, v, unit, id } = data;
  group = group || createThingTextGroup(data, "thingTextGroup", position);
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

// 创建可编辑的文本
export const createEditableText = (
  stage: Konva.Stage,
  position: { x: number; y: number },
  themeType: Theme
) => {
  const thingLayer = layer(stage, "thing");
  const Text = theme[themeType].text;
  const { x, y } = position;
  const textNode = createText({
    ...Text,
    name: "selfText",
    draggable: true,
    editable: true,
    width: 200,
    x,
    y,
  });
  setCustomAttrs(textNode, { width: 200 });
  thingLayer.add(textNode);

  return textNode;
};
export const editorText = (textNode: Konva.Text, stage: Konva.Stage) => {
  const textPosition = textNode.getAbsolutePosition();

  // then lets find position of stage container on the page:
  const stageBox = stage.container().getBoundingClientRect();
  const areaPosition = {
    x: stageBox.left + textPosition.x,
    y: stageBox.top + textPosition.y,
  };
  const textarea = document.createElement("textarea");
  textarea.value = textNode.text();
  textarea.style.position = "absolute";
  textarea.style.top = areaPosition.y + "px";
  textarea.style.left = areaPosition.x + "px";
  textarea.style.width = textNode.width() + "px";
  textarea.style.backgroundColor = "white";
  textarea.style.color = "black";
  document.body.appendChild(textarea);

  textNode.opacity(0);
  textarea.focus();
  textarea.addEventListener("keydown", function (e) {
    // hide on enter
    if (e.keyCode === 13) {
      textNode.text(textarea.value);
      stage.draw();
      document.body.removeChild(textarea);
      textNode.opacity(1);
    }
  });
  textarea.addEventListener("blur", function (e) {
    textNode.text(textarea.value);
    stage.draw();
    document.body.removeChild(textarea);
    textNode.opacity(1);
  });
};

// 查询复杂的thing文字
export const getThingAdvancedText = (parent: Parent) => {};

// 修改thing 文字的主题
export const changeThingTextTheme = (themeType: Theme) => {};

// 创建文字
export const createLineTexts = (
  stage: Konva.Stage,
  iu: string,
  lineId: string,
  themeType: Theme
) => {
  const thingGroup = stage.findOne(`#${iu}`) as Konva.Group;

  const line = stage.findOne(`#${lineId}`) as Konva.Group;

  const def = (data: thingTextInfo, cb?: (thingTextGroup: Group) => void) => {
    const { label, v, unit, code, id } = data;
    const pointBegin = getUsePoint(line.attrs.points)[0];
    const point = {
      x: pointBegin.x,
      y: pointBegin.y,
    };
    const textShape = createThingDefaultText(
      themeType,
      {
        label: label,
        v: v,
        unit: unit,
        code,
        id,
      },
      {
        x: point.x,
        y: point.y,
      }
    );
    thingGroup?.add(textShape);

    textShape.setAttrs({
      draggable: true,
    });
    cb ? cb(textShape) : null;
  };
  const advanced = (
    data: thingTextInfo,
    cb?: (thingTextGroup: Group) => void
  ) => {
    const { label, v, unit, code, id } = data;
    const pointBegin = getUsePoint(line.attrs.points)[0];
    const point = {
      x: pointBegin.x,
      y: pointBegin.y,
    };
    const group = createThingAdvancedText(
      themeType,
      {
        label: label,
        v: v,
        unit: unit,
        code,
        id,
      },
      {
        x: point.x,
        y: point.y,
      }
    );
    thingGroup?.add(group);
    cb ? cb(group) : null;
  };
  return {
    advanced,
    def,
    // 批量添加文字
    batchAddText: (list) => {
      for (let i of list) {
        const { type, value, id } = i;
        if (type === "advanced") {
          advanced({
            ...value,
            id,
          });
        } else {
          def({
            ...value,
            id,
          });
        }
      }
    },

    changeTo: (id: string) => {
      thingGroup.getChildren().forEach((item) => {
        const attrs = getCustomAttrs(item);
        if (attrs.propertyId && attrs.propertyId === id) {
          const name = item.name();
          (item as Konva.Group).removeChildren();

          setCustomAttrs(item, attrs);
          if (name === groupNames.thingDefTextGroup) {
            item.setAttrs({
              name: groupNames.thingTextGroup,
            });
            createThingAdvancedText(
              themeType,
              attrs.thingTextInfo,
              item.position() || { x: 0, y: 0 },
              item as Konva.Group
            );
          } else {
            createThingDefaultText(
              themeType,
              attrs.thingTextInfo,
              item.position() || { x: 0, y: 0 },
              item as Konva.Group
            );
            item.setAttrs({
              name: groupNames.thingDefTextGroup,
            });
          }
          item.draw();
          toSelect(stage, [item]);
        }
      });
    },
    changeVal: (id: string, val: string) => {
      thingGroup.getChildren().forEach((item: Konva.Group) => {
        if (item.attrs.id && item.attrs.id === id) {
          const name = item.name();
          const attrs = getCustomAttrs(item);
          const thingTextInfo = { ...attrs.thingTextInfo, v: val };
          setCustomAttrs(item, {
            ...attrs,
            thingTextInfo,
          });
          if (name === groupNames.thingDefTextGroup) {
            item.setAttrs({
              name: groupNames.thingDefTextGroup,
            });
            item.children[0].setAttrs({ text: val });
          } else {
            item.children[2].setAttrs({ text: val });
          }
          item.draw();
        }
      });
    },
  };
};