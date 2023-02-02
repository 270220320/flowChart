import Konva from "konva";
import { LineTheme } from "./line";
import { RectTheme } from "./rect";
import { ScaleTheme } from "./scale";
import { SelectionTheme } from "./selection";
import { ThingText, ThingTextType } from "./thingText";

interface ThemeInfo {
  scale: Konva.NodeConfig;
  background: string;
  subLine: Konva.NodeConfig;
  rect: Konva.NodeConfig;
  selection: Konva.NodeConfig;
  thingText: ThingTextType;
}
export type Theme = "light" | "dark";
export const defaultTheme: Theme = "dark";

const thtmeInfo: Record<Theme, ThemeInfo> = {
  light: {
    scale: ScaleTheme.light,
    background: "#F0F3FA",
    subLine: LineTheme.light,
    rect: RectTheme.light,
    selection: SelectionTheme.light,
    thingText: ThingText.light,
  },
  dark: {
    scale: ScaleTheme.dark,
    background: "#08163B",
    subLine: LineTheme.dark,
    rect: RectTheme.dark,
    selection: SelectionTheme.dark,
    thingText: ThingText.dark,
  },
};

export default thtmeInfo;
