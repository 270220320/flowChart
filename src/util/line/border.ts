import Konva from "konva";
import { UUID } from "../uuid";
import layer from "../layer";
import { createThingGroup } from "@/element";
import { getCustomAttrs, setCustomAttrs } from "../customAttr";
import { getUsePoint } from "./line";
import INLEDITOR from "@/index";
import { LineTheme } from "@/config/line";

export const addLineBorder = (line: Konva.Line, ie: INLEDITOR) => {
  line.setAttrs({
    pointerWidth: 0,
    strokeWidth: 2,
    dash: line.attrs.dash || [8, 8, 8, 8],
  });
  // const border = new Konva.Shape({
  //   id: UUID(),
  //   points: line.attrs.points,
  //   stroke: "red",
  //   strokeWidth: 4,
  //   name: "border",
  //   sceneFunc: function (context, shape) {
  //     const attrs = shape.attrs;
  //     const points = getUsePoint(attrs.points);

  //     context.beginPath();
  //     context.lineWidth = 6;
  //     context.strokeStyle = LineTheme[ie.getTheme()].borderInner;
  //     context.moveTo(attrs.points[0], attrs.points[1]);
  //     points.forEach((point, index) => {
  //       if (index !== 0) {
  //         context.lineTo(point.x, point.y);
  //       }
  //     });
  //     context.stroke();
  //   },
  // });
  // border.attrs.cdata = {};
  // line.parent.add(border);
  // border.moveToBottom();
  const borderInner: Konva.Line = line.clone({
    id: UUID(),
    strokeWidth: 6,
    stroke: LineTheme[ie.getTheme()].borderInner,
    name: "borderInner",
    dashEnabled: false,
  });
  borderInner.attrs.cdata = {};
  line.parent.add(borderInner);
  borderInner.moveToBottom();
  const borderOut: Konva.Line = line.clone({
    id: UUID(),
    strokeWidth: 8,
    stroke: LineTheme[ie.getTheme()].borderOuter,
    name: "borderOut",
    dashEnabled: false,
  });
  borderOut.attrs.cdata = {};
  line.parent.add(borderOut);
  borderOut.moveToBottom();

  const oldSet = line.setAttrs;
  function newSet(config: any) {
    if (config.points) {
      const borderOut = this.parent.findOne(".borderOut");
      borderOut.setAttrs({ points: config.points });
      const borderInner = this.parent.findOne(".borderInner");
      borderInner.setAttrs({ points: config.points });
    }
    return oldSet.bind(this)(config);
  }
  line.setAttrs = newSet;
};

export const resetLine = (ie) => {
  const stage = ie.getStage();
  const lineLayer = layer(stage, "line");
  const lineArr = lineLayer.find("Arrow");
  for (let i = 0; i < lineArr.length; i++) {
    const line: Konva.Arrow = lineArr[i] as Konva.Arrow;

    if (line.name().indexOf("border") > -1) {
      line.remove();
    } else {
      line.name("line");
      if (line.parent.name() !== "thingGroup") {
        const group = createThingGroup({});
        group.setAttrs({ draggable: false });
        line.getLayer().add(group);
        group.add(line);
      }
      const info = getCustomAttrs(line);
      // 管道 重置border和线
      if (info.lineInfo.type.toLowerCase().indexOf("dotted") === -1) {
        const newLine = new Konva.Line(line.attrs);
        const data = getCustomAttrs(line);
        setCustomAttrs(newLine, data);
        line.parent.add(newLine);
        line.destroy();
        addLineBorder(newLine, ie);
      }
    }
  }
};
