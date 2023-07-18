import Konva from "konva";
import theme, { Theme } from "../config/theme";
import { thingTextInfo } from "../data/cdata";
import { Thing } from "../data/thing";
import { setCustomAttrs } from "../util/customAttr";
import layer, { LAYER } from "../util/layer";

export type GroupNames =
  | "thingGroup"
  | "thingTextGroup"
  | "thingDefTextGroup"
  | "thingInputGroup"
  | "thingSwitchGroup"
  | "thingButtonGroup";
export const groupNames: Record<GroupNames, GroupNames> = {
  thingGroup: "thingGroup",
  thingTextGroup: "thingTextGroup",
  thingDefTextGroup: "thingDefTextGroup",
  thingButtonGroup: "thingButtonGroup",
  thingInputGroup: "thingInputGroup",
  thingSwitchGroup: "thingSwitchGroup",
};
export type Parent = Konva.Group | Konva.Layer | Konva.Stage;
export type Child =
  | Konva.Group
  | Konva.Layer
  | Konva.Line
  | Konva.Circle
  | Konva.Rect
  | Konva.Text;

// 创建thing 的组
export const createThingGroup = (useThing: Thing, id?: string) => {
  const group = new Konva.Group({
    draggable: true,
    id: id || useThing?.iu,
    name: useThing.type || groupNames.thingGroup,
  });
  setCustomAttrs(group, { thing: useThing, type: groupNames.thingGroup });
  return group;
};
// 查询thing的组
export const getThingGroups: (parent: Parent) => Array<Konva.Group> = (
  parent
) => {
  return parent.find(`.${groupNames.thingGroup}`);
};
export const getThingGroup: (parent: Parent, iu: string) => Konva.Group = (
  parent,
  iu
) => {
  return parent.findOne(`#${iu}`);
};

// 创建thingtext 的组
export const createThingTextGroup = (
  data: thingTextInfo,
  name: keyof typeof groupNames,
  position: { x: number; y: number }
) => {
  const { x, y } = position;
  const { code, id } = data;
  const group = new Konva.Group({
    name: name,
    draggable: true,
    x: x || 0,
    y: y || 0,
  });
  setCustomAttrs(group, {
    thingTextInfo: data,
    state: "defalut",
    propertyId: id,
    propertyCode: code,
  });
  return group;
};

// 查询 thingText的租
export const getThingTextGroup = (
  group: Konva.Group,
  name?: keyof typeof groupNames
) => {
  if (name) return group.find<Konva.Group>(`.${name}`);
  return group.children.filter(
    (ele) => ele.name() !== "thingImage"
  ) as Konva.Group[];
};

// 设置复杂thing text 的组主题
export const setThingTextGroupTheme = (ea: Konva.Group, themeType: Theme) => {
  const t = theme[themeType];
  const label = ea.findOne(".label");
  const rect = ea.findOne(".rect");
  const val = ea.findOne(".val");
  const unit = ea.findOne(".unit");

  if (label) {
    label.setAttrs({
      fill: t.thingText.advanced.label.fill,
    });
  }

  if (rect) {
    rect.setAttrs({
      fill: t.thingText.advanced.val.rectFill,
      stroke: t.thingText.advanced.val.rectStroke,
    });
  }
  if (val) {
    val.setAttrs({
      fill: t.thingText.advanced.val.fill,
    });
  }
  if (unit) {
    unit.setAttrs({
      fill: t.thingText.advanced.unit.fill,
      opacity: t.thingText.advanced.unit.opacity,
    });
  }
};

export const setThingDefTextGroupTheme = (
  ea: Konva.Group,
  themeType: Theme
) => {
  const t = theme[themeType];
  const val = ea.findOne(".val");
  if (val) {
    val.setAttrs({
      fill: t.thingText.def.val.fill,
    });
  }
};

// 设置 Thing 组的样式
export const setThingGroupTheme = (stage: Konva.Stage, themeType: Theme) => {
  const thingLayer = layer(stage, LAYER.thing);
  getThingGroups(thingLayer).forEach((item) => {
    getThingTextGroup(item, groupNames.thingTextGroup).forEach((ea) => {
      setThingTextGroupTheme(ea, themeType);
    });
    getThingTextGroup(item, groupNames.thingDefTextGroup).forEach((ea) => {
      setThingDefTextGroupTheme(ea, themeType);
    });
    // 还需要处理其他样式主题
  });
  const lineLayer = layer(stage, LAYER.line);
  getThingGroups(lineLayer).forEach((item) => {
    getThingTextGroup(item, groupNames.thingTextGroup).forEach((ea) => {
      setThingTextGroupTheme(ea, themeType);
    });
    getThingTextGroup(item, groupNames.thingDefTextGroup).forEach((ea) => {
      setThingDefTextGroupTheme(ea, themeType);
    });
    // 还需要处理其他样式主题
  });
};
