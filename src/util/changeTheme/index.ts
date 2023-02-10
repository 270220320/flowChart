import Konva from "konva";
import { Theme } from "@/config/theme";
import { setThingGroupTheme } from "@/element/group";
import { changeLineTheme } from "../line/line";

export default (
  stage: Konva.Stage,
  themeType: Theme,
  callBack?: (stage: Konva.Stage) => {}
) => {
  // 修改thing 组的主题
  setThingGroupTheme(stage, themeType);

  changeLineTheme(stage, themeType);

  // 可以由用户自己控制主题特定项目
  if (callBack) callBack(stage);
};
