import konva from "konva";
import INLEDITOR from "@/index";
import theme from "@/config/theme";
import resetImg from "./resetImg";
import disableMove from "./disableMove";
import test from "@/test";

export default (ie: INLEDITOR, json?: string) => {
  const { id } = ie.opt;
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
      width: offsetWidth,
      height: offsetHeight,
      background: "#dddddd",
    });
    ie.setStage(stage);
  } else {
    stage = new konva.Stage({
      container: id,
      width: offsetWidth,
      height: offsetHeight,
      draggable: true,
      background: "#dddddd",
    });
    ie.setStage(stage);
  }

  stage = ie.getStage();
  let container = stage.container();
  ie.setContainer(container);

  container.tabIndex = 1;
  container.setAttribute(
    "style",
    `background: ${theme[themeType].background}; position: relative;`
  );
  resetImg(stage);

  if (ie.opt.isPreview) {
    disableMove(ie.getStage());
  }
<<<<<<< HEAD
=======
  test(ie);
  // watchElement(id, (dm) => {
  //   stage.size({
  //     width: dm.offsetWidth,
  //     height: dm.offsetHeight,
  //   });
  // });
>>>>>>> 6dcb518ea8810aaca14d52b59e3ac0a1af5cff11
};
