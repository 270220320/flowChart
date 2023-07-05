import Konva from "konva";
import theme, { Theme } from "../config/theme";
import { Child, Parent, groupNames } from "./group";
import { thingTextInfo } from "../data/cdata";
import { THINGTEXT } from "../data/dropData";
import layer from "../util/layer";
import { getCustomAttrs, setCustomAttrs } from "../util/customAttr";
import { toSelect } from "@/event/selectItem";
import { Group } from "konva/lib/Group";
import INLEDITOR from "..";
import buttonText from "./texts/buttonText";
import { createThingDefaultText } from "./texts/simpleText";
import { createThingAdvancedText } from "./texts/complexText";
import { createText } from "./texts";
import inputText from "./texts/inputText";
import switchText from "./texts/switchText";

const createTextFun = {};
createTextFun[groupNames.thingDefTextGroup] = createThingDefaultText;
createTextFun[groupNames.thingTextGroup] = createThingAdvancedText;
createTextFun[groupNames.thingButtonGroup] = buttonText.add;
createTextFun[groupNames.thingInputGroup] = inputText.add;
createTextFun[groupNames.thingSwitchGroup] = switchText.add;

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
    if (e.name() === groupNames.thingDefTextGroup) {
      const info = getCustomAttrs(e).thingTextInfo;
      text.setAttrs({
        text: val + (info.unit || ""),
      });
    } else if (e.name() === groupNames.thingTextGroup) {
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
export const createThingTexts = (
  ie: INLEDITOR,
  iu: string,
  themeType: Theme
) => {
  const stage = ie.getStage();
  const thingGroup = stage.findOne(`#${iu}`) as Konva.Group;
  if (!thingGroup) return {};
  const thing = thingGroup.findOne(".thingImage");
  let line;
  if (!thing) {
    line = thingGroup.children.find((node) => node.className === "Arrow");
  }
  const addText = (
    data: thingTextInfo,
    type,
    cb?: (thingTextGroup: Group) => void
  ) => {
    let point;
    if (thing) {
      point = {
        x:
          (thingGroup.getClientRect().x - thingGroup.getAbsolutePosition().x) /
          stage.scaleX(),
        y:
          (thingGroup.getClientRect().y -
            thingGroup.getAbsolutePosition().y +
            thingGroup.getClientRect().height) /
          stage.scaleX(),
      };
    } else {
      point = {
        x: line.attrs.points[0],
        y: line.attrs.points[1] + (thingGroup.children.length - 1) * 25,
      };
    }
    const group = createTextFun[type](themeType, data, {
      x: point.x,
      y: point.y,
    });
    thingGroup.add(group);
    cb ? cb(group) : null;
  };
  return {
    addText,
    // 批量添加文字
    batchAddText: (list: { type: string; info: thingTextInfo }[]) => {
      for (let i of list) {
        // 临时 111
        i.type = groupNames.thingSwitchGroup;
        i.info = i.value || i.info;
        // 临时end
        const { type, info } = i;

        addText(info, type);
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
          } else if (name === "thingTextGroup") {
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
          toSelect(ie, [item]);
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
          } else if (name === "thingTextGroup") {
            item.children[2].setAttrs({ text: val });
          }
          // 待添加其他类型
          item.draw();
        }
      });
    },
  };
};
