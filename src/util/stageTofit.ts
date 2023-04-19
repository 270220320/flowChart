import { clearTransFormer } from "@/event/selectItem";
import Konva from "konva";
import layer from "./layer";

/**
 * @description 计算缩放后的坐标
 * @param x
 * @param y
 * @param p
 * @param scale
 * @returns
 */
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

/**
 * @description 居中缩放
 * @param stage
 */
const tofit = (stage: Konva.Stage) => {
  // 清除变换器
  clearTransFormer(stage);
  // 获取thing层的边界框
  const thingLayer = layer(stage, "thing");

  // 移动位置
  const movePosition = (data) => {
    // 原始layer的位置信息
    const { x, y, width, height } = data;
    // 当前舞台的位置信息
    const p = stage.position();
    //
    const sjx = -(x - p.x);
    const sjy = -(y - p.y);

    const stageMove1 = new Konva.Tween({
      node: stage,
      x: sjx + (stage.width() - width * stage.scaleX()) / 2,
      y: sjy + (stage.height() - height * stage.scaleY()) / 2,
      // x: sjx + stage.width() * 0.05,
      // y: sjy + stage.height() * 0.0001,
      easing: Konva.Easings.EaseIn,
      duration: 0.5,
    });
    stageMove1.play();
  };

  // 获取边界框
  const { x, y, width, height } = thingLayer.getClientRect();

  // 获取当前缩放比例 保留5位小数
  const scaleOld = Number(stage.scaleX().toFixed(5));
  // 计算缩放比例
  const scale = Number(
    Math.min(
      (stage.width() / width) * scaleOld,
      (stage.height() / height) * scaleOld
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
      width,
      height,
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
