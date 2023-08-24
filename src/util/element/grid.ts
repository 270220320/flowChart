import Konva from "konva";
import INLEDITOR from "@/index";
import layer from "../layer";
import { gridLineTheme } from "@/config";
import computedXY from "../computedXY";

export const addGrid = (ie: INLEDITOR) => {
  const step = ie.opt.step;
  const stage = ie.getStage();
  const utilLay = layer(stage, "thing");
  const field: Konva.Node = ie.getStage().findOne(".field");
  const x =
    (field.getClientRect().x - field.getAbsolutePosition().x) / stage.scaleX();
  const x2 =
    (field.getClientRect().x -
      field.getAbsolutePosition().x +
      field.getClientRect().width) /
    stage.scaleX();
  const y =
    (field.getClientRect().y - field.getAbsolutePosition().y) / stage.scaleY();
  const y2 =
    (field.getClientRect().y -
      field.getAbsolutePosition().y +
      field.getClientRect().height) /
    stage.scaleX();
  for (let i = step; i < x2; i += step) {
    const line = new Konva.Line({
      points: [x + i, y, x + i, y2],
      stroke: gridLineTheme[ie.getTheme()].stroke,
      strokeWidth: 1,
      draggable: false,
      name: "grid",
    });
    utilLay.add(line);
    line.moveToBottom();
  }
  for (let i = step; i < y2; i += step) {
    const line = new Konva.Line({
      points: [x, y + i, x2, y + i],
      stroke: gridLineTheme[ie.getTheme()].stroke,
      strokeWidth: 1,
      draggable: false,
      name: "grid",
    });
    utilLay.add(line);
    line.moveToBottom();
  }
  field.moveToBottom();
};

export const clearGrid = (stage) => {
  stage.find(".grid").forEach((ele) => {
    ele.destroy();
  });
};
