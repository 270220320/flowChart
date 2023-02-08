import konva from "konva";
import INLEDITOR from "src";
import theme from "src/config/theme";
import resetImg from "./resetImg";

export default (ie: INLEDITOR, json?: string) => {
  const { id } = ie.opt;
  const dom = document.getElementById(id)!;
  const { offsetWidth, offsetHeight } = dom;
  if (ie.stage) {
    ie.stage.destroy();
  }

  if (json) {
    ie.stage = konva.Node.create(json, id);
    ie.stage.setAttrs({
      width: offsetWidth,
      height: offsetHeight,
    });
  } else {
    ie.stage = new konva.Stage({
      container: id,
      width: offsetWidth,
      height: offsetHeight,
      draggable: true,
    });
  }
  ie.stage.container().tabIndex = 1;
  ie.container = ie.stage.container();
  ie.container.setAttribute(
    "style",
    `background: ${theme[ie.theme].background}; position: relative;`
  );
  resetImg(ie.stage);
  // watchElement(id, (dm) => {
  //   stage.size({
  //     width: dm.offsetWidth,
  //     height: dm.offsetHeight,
  //   });
  // });
};
