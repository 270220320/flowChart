import Konva from "konva";
import INLEDITOR from "src";
import theme, { Theme } from "src/config/theme";
import { createThingDefaultText, createThingText } from "src/config/thing.text";

export default function (
  this: INLEDITOR,
  themeType: Theme,
  callBack?: (stage: Konva.Stage) => {}
) {
  this.theme = themeType;
  this.stage.find(".thingGroup").forEach((e: any) => {
    e.find(".thingTextGroup").forEach((ea: any) => {
      const { labelv, unitval, val, x, y } = ea.attrs;
      const parent = ea.getParent();
      ea.remove();
      parent.add(
        createThingText(themeType, { x, y, labelv, value: val, unitval })
      );
    });
    e.find(".createThingDefaultText").forEach((ea: any) => {
      const { text, x, y } = ea.attrs;
      const parent = ea.getParent();
      ea.remove();
      parent.add(createThingDefaultText(themeType, { text, x, y }));
      parent.draw();
    });
  });

  this.container.style.background = theme[themeType].background;
  // 可以由用户自己控制主题特定项目
  if (callBack) callBack(this.stage);
}
