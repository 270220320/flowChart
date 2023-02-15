import konva from "konva";
import INLEDITOR from "@/index";
import theme from "@/config/theme";
import resetImg from "./resetImg";
import disableMove from "./disableMove";

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
  console.log(ie.opt.isPreview);
  // watchElement(id, (dm) => {
  //   stage.size({
  //     width: dm.offsetWidth,
  //     height: dm.offsetHeight,
  //   });
  // });
};
