import konva from "konva";
import INLEDITOR from "src";
import theme from "src/config/theme";
import watchElement from "../watchElement";
import resetImg from "./resetImg";

export default function (this: INLEDITOR, id: string, json?: string) {
  const dom = document.getElementById(id)!;
  const { offsetWidth, offsetHeight } = dom;
  this.stage ? this.stage.clear() : null;
  let stage: konva.Stage, container: HTMLDivElement;

  if (json) {
    stage = konva.Node.create(json, id);
    console.log(stage);
  } else {
    stage = new konva.Stage({
      container: id,
      width: offsetWidth,
      height: offsetHeight,
      draggable: true,
    });
  }
  container = stage.container();
  container.tabIndex = 1;
  container.setAttribute(
    "style",
    `background: ${theme[this.theme].background}; position: relative;`
  );
  resetImg(stage);
  // watchElement(id, (dm) => {
  //   stage.size({
  //     width: dm.offsetWidth,
  //     height: dm.offsetHeight,
  //   });
  // });
  return {
    stage,
    container,
  };
}
