import Konva from "konva";
import layer from "./layer";

export const computedZoomCoord = (x: number, y: number, stage: Konva.Stage) => {
  const zoom = stage.scale()!;
  let left = x;
  let top = y;
  if (stage.position()) {
    left = (left - stage.position().x) / zoom.x;
    top = (top - stage.position().y) / zoom.x;
  }
  return {
    left,
    top,
  };
};

export default (stage: Konva.Stage) => {
  const objects = layer(stage, "thing").getChildren();
  let rect = objects[0].getClientRect();
  let minX = rect.x;
  let minY = rect.y;
  let maxX = rect.x + rect.width;
  let maxY = rect.y + rect.height;
  if (objects.length > 0) {
    for (let i = 1; i < objects.length; i++) {
      rect = objects[i].getClientRect();
      minX = Math.min(minX, rect.x);
      minY = Math.min(minY, rect.y);
      maxX = Math.max(maxX, rect.x + rect.width);
      maxY = Math.max(maxY, rect.y + rect.height);
    }
  }
  //计算平移坐标
  const { left, top } = computedZoomCoord(minX, minY, stage);

  //计算缩放比例
  const zoom =
    Math.min(stage.width() / (maxX - minX), stage.height() / (maxY - minY)) *
    0.9;
  const stageMove = new Konva.Tween({
    node: stage,
    x: left,
    y: top,
    // scaleX: zoom,
    // scaleY: zoom,
    easing: Konva.Easings.EaseIn,
    duration: 0.5,
  });
  stageMove.play();
};
