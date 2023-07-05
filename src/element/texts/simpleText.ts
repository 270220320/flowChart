import theme, { Theme } from "../../config/theme";
import { thingTextInfo } from "@/data/cdata";
import Konva from "konva";
import { createThingTextGroup } from "../group";
import { createText } from "./";

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
