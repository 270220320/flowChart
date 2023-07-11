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
    const btnText = createText(
      {
        fill: "white",
        fontSize: advanced.val.size,
        text: data.btns[0],
        draggable: false,
        x: labelText.width() + 5,
        y: 1,
        align: "center",
        height: advanced.val.rectHeight,
        name: "btn",
      },
      id
    );
    const valRect = defaultRect({
      fill: "#1D33A2",
      stroke: "#1D33A2",
      strokeWidth: 1,
      height: advanced.val.rectHeight,
      width: btnText.width() + 10,
      draggable: false,
      x: labelText.width(),
      cornerRadius: 3,
      name: "rect",
    });

    group.add(valRect, labelText, btnText);
    return group;
  },
};
