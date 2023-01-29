import konva from "konva";
import watchElement from "./watchElement";

export default (id: string) => {
  const dom = document.getElementById(id)!;
  const { offsetWidth, offsetHeight } = dom;
  const stage = new konva.Stage({
    container: id,
    width: offsetWidth,
    height: offsetHeight,
  });
  const container = stage.container();
  container.tabIndex = 1;

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
