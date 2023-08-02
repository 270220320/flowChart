import konva from "konva";
import INLEDITOR from "@/index";
import theme from "@/config/theme";
import disableMove from "./disableMove";
import { FieldTheme } from "@/config/field";
import keyDown from "@/event/keyDown";

export default (ie: INLEDITOR, json?: string | null) => {
  const { id, isPreview } = ie.opt;
  let stage = ie.getStage();
  const dom = document.getElementById(id)!;
  const { offsetWidth, offsetHeight } = dom;
  const themeType = ie.getTheme();
  if (stage) {
    stage.destroy();
    keyDown(ie, false);
  }
  if (json) {
    stage = konva.Node.create(json, id);
    stage.setAttrs({
      width: offsetWidth,
      height: offsetHeight,
      background: "#dddddd",
      draggable: isPreview ? false : true,
    });
    ie.setStage(stage);
  } else {
    stage = new konva.Stage({
      container: id,
      width: 1920,
      height: 1080,
      draggable: false,
      background: "#dddddd",
    });
    ie.setStage(stage);
  }

  stage = ie.getStage();
  let container = stage.container();
  ie.setContainer(container);
  container.children[0].setAttribute("id", "myCanvas");

  container.tabIndex = 1;
  const color = isPreview
    ? FieldTheme[themeType].fill
    : theme[themeType].background;
  container.setAttribute("style", `background: ${color}; position: relative;`);

  if (ie.opt.isPreview) {
    disableMove(ie.getStage());
  }
  // test(ie);
  // watchElement(id, (dm) => {
  //   stage.size({
  //     width: dm.offsetWidth,
  //     height: dm.offsetHeight,
  //   });
  // });
};
