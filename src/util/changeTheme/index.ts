import Konva from "konva";
import INLEDITOR from "src";
import theme, { Theme } from "src/config/theme";
import {
  setThingTextGroupTheme,
  getThingGroups,
  getThingTextGroup,
} from "src/config/thing.group";
import {
  setThingDefaultTextTheme,
  getThingDefaultText,
} from "src/config/thing.text";

export default function (
  this: INLEDITOR,
  themeType: Theme,
  callBack?: (stage: Konva.Stage) => {}
) {
  this.theme = themeType;
  getThingGroups(this.stage).forEach((e: any) => {
    // 修改组thing文字组的样式
    getThingTextGroup(e).forEach((ea: any) => {
      setThingTextGroupTheme(ea, this.theme);
    });
    getThingDefaultText(e).forEach((ea: any) => {
      setThingDefaultTextTheme(ea, this.theme);
    });
  });

  this.container.style.background = theme[themeType].background;
  // 可以由用户自己控制主题特定项目
  if (callBack) callBack(this.stage);
}
