import Konva from "konva";
import { getBackgroundRect } from "src/element/rect";

export default (stage: Konva.Stage) => {
  const rect = getBackgroundRect(stage);
  rect.absolutePosition({ x: 0, y: 0 });
  rect.scale({
    x: 1,
    y: 1,
  });
};
