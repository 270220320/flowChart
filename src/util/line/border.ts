import Konva from "konva";
import { UUID } from "../uuid";
import layer from "../layer";
import { createThingGroup } from "@/element";
import { getCustomAttrs } from "../customAttr";

export const addLineBorder = (line: Konva.Arrow) => {
  const cloneLine: Konva.Arrow = line.clone({
    id: UUID(),
    strokeWidth: 8,
    stroke: "grey",
    name: "border",
  });
  cloneLine.attrs.cdata = {};
  line.parent.add(cloneLine);
  cloneLine.moveToBottom();

  const oldSet = line.setAttrs;
  function newSet(config: any) {
    if (config.points) {
      const border = this.parent.findOne(".border");
      border.setAttrs({ points: config.points });
    }
    return oldSet.bind(this)(config);
  }
  line.setAttrs = newSet;
};

export const resetLine = (stage) => {
  const lineLayer = layer(stage, "line");
  const lineArr = lineLayer.find("Arrow");
  for (let i = 0; i < lineArr.length; i++) {
    const line: Konva.Arrow = lineArr[i] as Konva.Arrow;

    if (line.name() === "border") {
      line.remove();
    } else {
      if (line.parent.name() !== "thingGroup") {
        const group = createThingGroup({});
        group.setAttrs({ draggable: false });
        line.getLayer().add(group);
        group.add(line);
      }
      const info = getCustomAttrs(line);
      if (info.lineInfo.type.toLowerCase().indexOf("dotted") === -1) {
        addLineBorder(line);
      }
    }
  }
};
