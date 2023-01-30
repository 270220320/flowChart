import { defaultRect } from "./rect.config";
import { createText } from "./text.config";
import theme, { Theme } from "./theme";
import { createThingTextGroup } from "./thing.group";

/**
 *
 * @param ea createThingDefaultText
 * @param themeType
 */
export const cloneThingDefaultText = (ea: any, themeType: Theme) => {
  const { text, x, y } = ea.attrs;
  const parent = ea.getParent();
  ea.remove();
  parent.add(createThingDefaultText(themeType, { text, x, y }));
  parent.draw();
};
export const createThingDefaultText = (
  themeType: Theme,
  data: { text: string; x?: number; y?: number }
) => {
  const t = theme[themeType];
  const { x, y, text } = data;
  return createText({
    x: x || 0,
    y: y || 0,
    fill: t.thingTitle.val.fill,
    fontSize: t.thingTitle.val.size,
    text: text,
    align: "center",
    height: t.showVal.val.rectHeight,
    name: "createThingDefaultText",
  });
};
export const getThingDefaultText = (e: any) => {
  return e.find(".createThingDefaultText");
};

/**
 * createThingText
 */
export const createThingText = (
  themeType: Theme,
  data: {
    labelv: string;
    value: string;
    unitval: string;
    x?: number;
    y?: number;
  }
) => {
  const { labelv, value, unitval } = data;
  console.log(data);
  const group = createThingTextGroup(data);
  const t = theme[themeType];
  const label = createText({
    fill: t.showVal.label.fill,
    fontSize: t.showVal.label.size,
    text: labelv,
    draggable: false,
    height: t.showVal.val.rectHeight,
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
  });
  const unit = createText({
    fill: t.showVal.unit.fill,
    fontSize: t.showVal.unit.size,
    opacity: t.showVal.unit.opacity,
    text: unitval,
    x: valRect.attrs.x + valRect.width() + 3,
    draggable: false,
    height: t.showVal.val.rectHeight,
  });

  group.add(valRect, label, val, unit);
  return group;
};
