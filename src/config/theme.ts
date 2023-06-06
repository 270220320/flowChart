import Konva from "konva";
import { subLineTheme } from "./line";
import { RectTheme } from "./rect";
import { ScaleTheme } from "./scale";
import { SelectionTheme } from "./selection";
import { ThingText, ThingTextType } from "./thingText";
import { Text } from "./text";
import { MapTitleTheme } from "./mapTitle";

interface ThemeInfo {
  scale: Konva.NodeConfig;
  background: string;
  subLine: Konva.NodeConfig;
  rect: Konva.NodeConfig;
  selection: Konva.NodeConfig;
  thingText: ThingTextType;
  text: Konva.TextConfig;
  MapTitleTheme: Konva.TextConfig;
}
export type Theme = "light" | "dark";
export const defaultTheme: Theme = "dark";

const thtmeInfo: Record<Theme, ThemeInfo> = {
  light: {
    scale: ScaleTheme.light,
    background: "#EFF2F6",
    subLine: subLineTheme.light,
    rect: RectTheme.light,
    selection: SelectionTheme.light,
    thingText: ThingText.light,
    text: Text.light,
    MapTitleTheme: MapTitleTheme.light,
  },
  dark: {
    scale: ScaleTheme.dark,
    background: "#000F37",
    subLine: subLineTheme.dark,
    rect: RectTheme.dark,
    selection: SelectionTheme.dark,
    thingText: ThingText.dark,
    text: Text.dark,
    MapTitleTheme: MapTitleTheme.dark,
  },
};
export { thtmeInfo };
export default thtmeInfo;
