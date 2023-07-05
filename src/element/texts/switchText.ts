import theme, { Theme } from "../../config/theme";
import { thingTextInfo } from "@/data/cdata";
import Konva from "konva";
import { createThingTextGroup, groupNames } from "../group";
import { createText } from ".";
import { defaultRect } from "../rect";

export default {
  add: (
    themeType: Theme,
    data: thingTextInfo,
    position: { x: number; y: number },
    group?: Konva.Group
  ) => {
    const { label, v, unit, id } = data;
    group =
      group ||
      createThingTextGroup(data, groupNames.thingButtonGroup, position);
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
    const btnText = createText({
      fill: advanced.val.fill,
      fontSize: advanced.val.size,
      text: "自动",
      draggable: false,
      x: labelText.width() + 5,
      align: "center",
      height: advanced.val.rectHeight,
      name: "btnText",
    });
    const checkRect = defaultRect({
      fill: "white",
      // stroke: advanced.val.rectStroke,
      strokeWidth: 0,
      height: advanced.val.rectHeight - 8,
      width: advanced.val.rectHeight - 8,
      draggable: false,
      x: btnText.x() + btnText.width() + 5,
      y: 4,
      cornerRadius: 3,
      name: "checkRect",
    });
    const btnRect = defaultRect({
      fill: advanced.val.rectFill,
      stroke: advanced.val.rectStroke,
      strokeWidth: 1,
      height: advanced.val.rectHeight,
      width: btnText.width() + checkRect.width() + 15,
      draggable: false,
      x: labelText.width(),
      cornerRadius: 3,
      name: "btnRect",
    });

    group.add(labelText, btnText, btnRect, checkRect);
    btnText.moveToTop();
    return group;
  },
};
