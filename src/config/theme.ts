import Konva from "konva";
import { subLineTheme } from "./line";
import { RectTheme } from "./rect";
import { ScaleTheme } from "./scale";
import { SelectionTheme } from "./selection";
import { ThingText, ThingTextType } from "./thingText";
import { Text } from "./text";

interface ThemeInfo {
  scale: Konva.NodeConfig;
  background: string;
  subLine: Konva.NodeConfig;
  rect: Konva.NodeConfig;
  selection: Konva.NodeConfig;
  thingText: ThingTextType;
  text: Konva.TextConfig;
}
export type Theme = "light" | "dark";
export const defaultTheme: Theme = "dark";

const thtmeInfo: Record<Theme, ThemeInfo> = {
  light: {
    scale: ScaleTheme.light,
    background: "#F0F3FA",
    subLine: subLineTheme.light,
    rect: RectTheme.light,
    selection: SelectionTheme.light,
    thingText: ThingText.light,
    text: Text.light,
  },
  dark: {
    scale: ScaleTheme.dark,
    background: "#000F37",
    subLine: subLineTheme.dark,
    rect: RectTheme.dark,
    selection: SelectionTheme.dark,
    thingText: ThingText.dark,
    text: Text.dark,
  },
};
export { thtmeInfo };
export default thtmeInfo;
