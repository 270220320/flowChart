import Konva from "konva";
import INLEDITOR from "src";
import layer from "src/util/layer";
import theme from "../../config/theme";

export const createScaleGroup = (ie: INLEDITOR) => {
  const layerScale = layer(ie, "util");
  layerScale.clear();
  const scaleGrop = new Konva.Group({
    name: "scaleGroup",
  });
  const scalex = createScaleX(ie, scaleGrop);
  const scaley = createScaleY(ie, scaleGrop);
  layerScale.add(scaleGrop.add(scalex, scaley));
};
const createScaleX = (ie: INLEDITOR, group: Konva.Group) => {
  const { scale } = theme[ie.theme];
  const groupX = new Konva.Group({
    name: "scaleGroupX",
  });
  const rect = new Konva.Rect({
    width: ie.stage.width(),
    height: scale.thickness,
    fill: scale.background,
  });
  groupX.add(rect);
  return groupX;
};
const createScaleY = (ie: INLEDITOR, group: Konva.Group) => {
  const { scale } = theme[ie.theme];
  const groupY = new Konva.Group({
    name: "scaleGroupY",
  });
  const rect = new Konva.Rect({
    width: scale.thickness,
    height: ie.stage.height(),
    fill: scale.background,
  });
  groupY.add(rect);
  return groupY;
};
export const getScaleGroup = (ie: INLEDITOR) => {
  return layer(ie, "util").findOne(".scaleGroup");
};
