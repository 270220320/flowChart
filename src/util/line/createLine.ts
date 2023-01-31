import Konva from "konva";
import INLEDITOR from "../..";
import { computedPoint, computedXYByEvent } from "src/util/computedXY";
import layer from "src/util/layer";
import { KonvaEventObject } from "konva/lib/Node";
import { getMouseOver } from "../";
import { getCustomAttrs, setCustomAttrs } from "../customAttr";
import { UUID } from "../uuid";

export const finishLine = (
  ie: INLEDITOR,
  begin: Konva.Rect | Konva.Group,
  line: Konva.Arrow,
  point: { x: number; y: number },
  e: KonvaEventObject<MouseEvent>
) => {
  ie.stage.setAttrs({ draggable: true });
  begin.setAttrs({ draggable: true });
  e.target.parent?.setAttrs({ draggable: true });
  let pos = ie.stage.getPointerPosition();
  const ele = getMouseOver(pos!, ie);

  debugger;
  if (ele) {
    setCustomAttrs(begin, {
      lineInfo: {
        outLines: [],
      },
    });
    const { lineInfo } = getCustomAttrs(begin);
    const data = {
      from: begin.id(),
      fromExcursionX: 0,
      fromExcursionY: 0,
      to: ele.id(),
      toExcursionX: 0,
      toExcursionY: 0,
    };
    setCustomAttrs(line, {
      lineInfo: data,
    });
    // setCustomAttrs(begin,{
    //   lineInfo: {
    //     outLines:[],
    //   }
    // })
    debugger;
  } else {
    line.remove();
  }
};

const createLineMove = (line: Konva.Arrow, point: { x: number; y: number }) => {
  line.attrs.points[2] = point.x;
  line.attrs.points[3] = point.y;
  line.points(line.attrs.points);
  // console.log(JSON.parse(JSON.stringify(line.attrs.points)));
};

// 线
export const beginCreateLine = (
  ie: INLEDITOR,
  point: { x: number; y: number },
  e: KonvaEventObject<MouseEvent>
) => {
  console.log(e.target);
  ie.stage.setAttrs({ draggable: false });
  e.target.setAttrs({ draggable: false });
  e.target.parent?.setAttrs({ draggable: false });

  const lay = layer(ie, "line");
  const line = createTemporaryLine(lay, point);
  ie.stage.on("mousemove", (e) => {
    const { x, y } = computedXYByEvent(ie.stage, e.evt);
    if (line) {
      createLineMove(line!, { x, y });
    }
  });
  return line;
};

export const createTemporaryLine = (
  layer: Konva.Layer,
  point: { x: number; y: number }
) => {
  var arrow = new Konva.Arrow({
    id: UUID(),
    points: [point.x, point.y, point.x, point.y],
    pointerLength: 20,
    pointerWidth: 20,
    fill: "black",
    stroke: "black",
    strokeWidth: 4,
  });

  layer.add(arrow);
  return arrow;
};