import Konva from "konva";
import theme, { Theme } from "../config/theme";
import { Child, GroupNames, Parent, groupNames } from "./group";
import { thingTextInfo } from "../data/cdata";
import { THINGTEXT, THINGTEXTINFO } from "../data/dropData";
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
import { changeTextLabel } from "@/util/element/text";

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
  const thingGroup = (stage.findOne(`#${iu}`) ||
    stage.findOne(`#line${iu}`)) as Konva.Group;

  if (!thingGroup) return {};
  const thing = thingGroup.findOne(".thingImage");
  let line;
  if (!thing) {
    line = thingGroup.children.find((node) => node.name() === "line");
  }
  const addText = (
    data: thingTextInfo,
    type: GroupNames,
    cb?: (thingTextGroup: Group, i: THINGTEXTINFO) => void,
    i?: THINGTEXTINFO
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
            thingGroup.getClientRect().height +
            5) /
          stage.scaleX(),
      };
    } else {
      point = {
        x: line.attrs.points[0],
        y: line.attrs.points[1] + (thingGroup.children.length - 1) * 25 + 5,
      };
    }
    const group = createTextFun[type](themeType, data, {
      x: point.x,
      y: point.y,
    });
    thingGroup.add(group);
    if (!data.showLabel) {
      changeTextLabel(group, data.showLabel);
    }
    if (data.color) {
      // 文字颜色
      const valNode = group.children.find((ele) => ele.name() === "val");
      valNode?.setAttrs({ fill: data.color });
      // 按钮颜色
      const rectNode = group.children.find((ele) => ele.name() === "rect");
      rectNode?.setAttrs({ fill: data.color });
    }
    cb ? cb(group, i) : null;
    return group;
  };
  return {
    addText,
    // 批量添加文字
    batchAddText: (
      list: { type: GroupNames; info: thingTextInfo }[],
      cb: (g: Konva.Group, i: THINGTEXTINFO) => void
    ) => {
      for (let i of list) {
        const { type, info } = i;
        addText(info, type, cb, i);
      }
    },
  };
};
