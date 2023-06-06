import Konva from "konva";
import layer from "./layer";
import INLEDITOR from "..";

// 获取 thingLayer 和 linerLayer 的最大宽度和高度
const getThingLayerMaxSize = (stage: Konva.Stage) => {
  // 获取 thingLayer 和 linerLayer 的宽度和高度
  const thingLayer = layer(stage, "thing").getClientRect();
  const linerLayer = layer(stage, "line").getClientRect();

  // 获取 stage 的宽度和高度
  const stageRect = {
    width: stage.width(),
    height: stage.height(),
    ...stage.position(),
  };
  // 缩放比例
  const sacle = stage.scaleX();
  // 获取 thingLayer 和 linerLayer 的最小 x 和 y
  const x = Math.min(thingLayer.x, linerLayer.x);
  const y = Math.min(thingLayer.y, linerLayer.y);

  // 获取thing和line 的最大 x 和 y
  const maxX = Math.max(
    thingLayer.x + thingLayer.width,
    linerLayer.x + linerLayer.width
  );
  const maxY = Math.max(
    thingLayer.y + thingLayer.height,
    linerLayer.y + linerLayer.height
  );
  /**
   * 1. 获取 thingLayer 和 linerLayer 的最大宽度和高度
   */
  return {
    layer: {
      x,
      y,
      width: maxX - x,
      height: maxY - y,
    },
    stageRect,
    sacle,
  };
};

// 计算 Irect
const computedIrect = (stage: Konva.Stage) => {
  const info = getThingLayerMaxSize(stage);
  const Irect = {
    x: (info.layer.x - info.stageRect.x) / stage.scaleX(),
    y: (info.layer.y - info.stageRect.y) / stage.scaleY(),
    width: info.layer.width / stage.scaleX(),
    height: info.layer.height / stage.scaleY(),
  };

  return Irect;
};

const bl = 1;
// 缩放到适合屏幕
export const stageTofit = (stage: Konva.Stage) => {
  const { layer, stageRect } = getThingLayerMaxSize(stage);
  const Irect = computedIrect(stage);

  const sjx = -(layer.x - stageRect.x);
  const sjy = -(layer.y - stageRect.y);

  stage.position({
    x: sjx,
    y: sjy,
  });
};

export default (ie: INLEDITOR) => {
  const { id } = ie.opt;
  let stage = ie.getStage();
  const dom = document.getElementById(id)!;
  // stage.scale({ x: 1, y: 1 });

  // const Irect = computedIrect(stage);
  // const scale =
  //   Math.min(stage.width() / Irect.width, stage.height() / Irect.height) * bl;
  const { offsetWidth, offsetHeight } = dom;
  const field: Konva.Node = stage.find(".field")[0];
  stage.position({
    x: 0,
    y: 0,
  });
  stage.scale({
    x: offsetWidth / field.attrs.width,
    y: offsetHeight / field.attrs.height,
  });
  // field.moveToBottom();
  // stageTofit(stage);
};
