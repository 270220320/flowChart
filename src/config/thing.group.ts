import Konva from "konva";
import { Thing } from "src/data/thing";
import theme, { Theme } from "./theme";
import { createThingText } from "./thing.text";

export const createThingGroup = (useThing: Thing) => {
  return new Konva.Group({
    cdata: {
      thihg: useThing,
      type: "thingGroup",
    },
    draggable: true,
    id: useThing?.iu,
    name: "thingGroup",
  });
};

export const getThingGroups = (stage: Konva.Stage) => {
  return stage.find(".thingGroup");
};

/**
 * createThingTextGroupData
 */
export interface createThingTextGroupData {
  labelv: string;
  value: string;
  unitval: string;
  code: string;
  x?: number;
  y?: number;
}
export const createThingTextGroup = (data: createThingTextGroupData) => {
  const { x, y, labelv, value, unitval, code } = data;
  return new Konva.Group({
    name: "thingTextGroup",
    draggable: true,
    code,
    x: x || 0,
    y: y || 0,
    cdata: {
      labelv,
      val: value,
      unitval,
    },
  });
};

export const getThingTextGroup = (stage: Konva.Stage | Konva.Group) => {
  return stage.find<Konva.Group>(".thingTextGroup");
};

export const setThingTextGroupTheme = (ea: Konva.Stage, themeType: Theme) => {
  const t = theme[themeType];
  const label = ea.findOne(".label");
  const rect = ea.findOne(".rect");
  const val = ea.findOne(".val");
  const unit = ea.findOne(".unit");

  label.setAttrs({
    fill: t.showVal.label.fill,
  });

  rect.setAttrs({
    fill: t.showVal.val.rectFill,
    stroke: t.showVal.val.rectStroke,
  });

  val.setAttrs({
    fill: t.showVal.val.fill,
  });

  unit.setAttrs({
    fill: t.showVal.unit.fill,
    opacity: t.showVal.unit.opacity,
  });
};
