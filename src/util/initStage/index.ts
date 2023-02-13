import konva from "konva";
import INLEDITOR from "@/index";
import theme from "@/config/theme";
import resetImg from "./resetImg";

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
    ie.setStage(konva.Node.create(json, id));
    ie.getStage().setAttrs({
      width: offsetWidth,
      height: offsetHeight,
      background: "#dddddd",
    });
  } else {
    ie.setStage(
      new konva.Stage({
        container: id,
        width: offsetWidth,
        height: offsetHeight,
        draggable: true,
        background: "#dddddd",
      })
    );
  }
  stage = ie.getStage();
  stage.container().tabIndex = 1;
  ie.setContainer(stage.container());
  ie.getContainer().setAttribute(
    "style",
    `background: ${theme[themeType].background}; position: relative;`
  );
  resetImg(stage);
  // watchElement(id, (dm) => {
  //   stage.size({
  //     width: dm.offsetWidth,
  //     height: dm.offsetHeight,
  //   });
  // });
};
