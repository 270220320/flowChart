import { clearTransFormer } from "@/event/selectItem";
import Konva from "konva";
import layer from "./layer";

export const computedZoomCoord = (
  x: number,
  y: number,
  p: { x: number; y: number },
  scale: number
) => {
  let left = x;
  let top = y;
  if (p) {
    left = left / scale;
    top = top / scale;
  }
  return {
    left,
    top,
  };
};

const tofit = (stage: Konva.Stage) => {
  clearTransFormer(stage);
  // 获取层的边界框
  const thingLayer = layer(stage, "thing");
  const movePosition = (data) => {
    const { x, y, scale } = data;
    const p = stage.position();
    const sjx = -(x - p.x);
    const sjy = -(y - p.y);

    const stageMove1 = new Konva.Tween({
      node: stage,
      x: sjx + stage.width() * 0.05,
      y: sjy + stage.height() * 0.05,
      easing: Konva.Easings.EaseIn,
      duration: 0.5,
    });
    stageMove1.play();
  };
  const { x, y, width, height } = thingLayer.getClientRect();
  const scaleOld = Number(stage.scaleX().toFixed(5));
  // 计算缩放比例
  const scale = Number(
    (
      Math.min(
        (stage.width() / width) * scaleOld,
        (stage.height() / height) * scaleOld
      ) * 0.9
    ).toFixed(5)
  );
  const stageMove = new Konva.Tween({
    node: stage,
    scaleX: scale,
    scaleY: scale,
    easing: Konva.Easings.EaseIn,
    duration: 0.2,
  });
  stageMove.play();
  stageMove.onFinish = () => {
    const data = {
      scale,
      x,
      y,
      scaleOld,
    };

    if (scaleOld !== scale) {
      const pp = thingLayer.getClientRect();
      data.x = pp.x;
      data.y = pp.y;
    }
    movePosition(data);
  };

  stage.batchDraw();
};

export default (stage: Konva.Stage) => {
  tofit(stage);
};
