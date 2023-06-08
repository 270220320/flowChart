import konva from "konva";
import INLEDITOR from "@/index";
import theme from "@/config/theme";
import disableMove from "./disableMove";

export default (ie: INLEDITOR, json?: string) => {
  const { id, isPreview } = ie.opt;
  let stage = ie.getStage();
  const dom = document.getElementById(id)!;
  const { offsetWidth, offsetHeight } = dom;
  const themeType = ie.getTheme();
  if (stage) {
    stage.destroy();
  }
  if (json) {
    stage = konva.Node.create(json, id);
    stage.setAttrs({
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
  container.setAttribute(
    "style",
    `background: ${theme[themeType].background}; position: relative;`
  );

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
