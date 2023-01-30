import Konva from "konva";
import INLEDITOR from "src";
import theme, { Theme } from "src/config/theme";
import {
  cloneThingTextGroup,
  getThingGroups,
  getThingTextGroup,
} from "src/config/thing.group";
import {
  cloneThingDefaultText,
  getThingDefaultText,
} from "src/config/thing.text";

export default function (
  this: INLEDITOR,
  themeType: Theme,
  callBack?: (stage: Konva.Stage) => {}
) {
  this.theme = themeType;
  getThingGroups(this.stage).forEach((e: any) => {
    getThingTextGroup(e).forEach((ea: any) => {
      cloneThingTextGroup(ea, this.theme);
    });
    getThingDefaultText(e).forEach((ea: any) => {
      cloneThingDefaultText(ea, this.theme);
    });
  });

  this.container.style.background = theme[themeType].background;
  // 可以由用户自己控制主题特定项目
  if (callBack) callBack(this.stage);
}
