import Konva from "konva";
import layer from "./layer";

export const computedZoomCoord = (x: number, y: number, stage: Konva.Stage) => {
  const zoom = stage.scale()!;
  let left = x;
  let top = y;
  if (stage.absolutePosition()) {
    left = (left - stage.absolutePosition().x) / zoom.x;
    top = (top - stage.absolutePosition().y) / zoom.y;
  }
  return {
    left,
    top,
  };
};

export default (stage: Konva.Stage) => {
  // 获取层的边界框

  const thingLayer = layer(stage, "thing");
  thingLayer.findOne("#ttttt")?.remove();
  thingLayer.batchDraw();
  const { x, y } = thingLayer.getClientRect();
  const { width, height } = thingLayer.getClientRect();

  const stagePosition = stage.absolutePosition();
  thingLayer.add(
    new Konva.Rect({
      width: width,
      height: height,
      x: x,
      y: y,
      fill: "red",
      id: "ttttt",
    })
  );
  // 计算缩放比例
  const scale = Math.min(stage.width() / width, stage.height() / height) * 0.8;

  // 缩放层

  const stageMove = new Konva.Tween({
    node: stage,
    x: -x,
    y: -y,
    // scaleX: scale,
    // scaleY: scale,
    easing: Konva.Easings.EaseIn,
    duration: 0.5,
  });
  stageMove.play();
  stage.batchDraw();
};
