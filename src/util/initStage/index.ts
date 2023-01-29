import konva from "konva";
import watchElement from "../watchElement";
import resetImg from "./resetImg";

export default (id: string, json?: string) => {
  const dom = document.getElementById(id)!;
  const { offsetWidth, offsetHeight } = dom;
  let stage: konva.Stage, container: HTMLDivElement;
  stage = json
    ? konva.Node.create(json, id)
    : new konva.Stage({
        container: id,
        width: offsetWidth,
        height: offsetHeight,
      });
  container = stage.container();
  container.tabIndex = 1;
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
};
