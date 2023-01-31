import Konva from "konva";
import { Thing } from "src/data/thing";
import { Theme } from "./theme";
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

export const getThingTextGroup = (stage: Konva.Stage) => {
  return stage.find(".thingTextGroup");
};

export const cloneThingTextGroup = (ea: Konva.Stage, themeType: Theme) => {
  const { labelv, unitval, val, code } = ea.attrs.cdata;
  const { x, y } = ea.attrs;
  const parent = ea.getParent();
  ea.remove();
  parent.add(
    createThingText(themeType, { x, y, labelv, value: val, unitval, code })
  );
};
