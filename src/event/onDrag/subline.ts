import Konva from "konva";
import { KonvaEventObject, Node, NodeConfig } from "konva/lib/Node";
import { Shape, ShapeConfig } from "konva/lib/Shape";
import { Stage } from "konva/lib/Stage";
import INLEDITOR from "@/index";
import { createSubLine, getSubLine } from "@/element/line";
import { Theme } from "@/config/theme";
import computedXY from "@/util/computedXY";
import layer from "@/util/layer";

// 查询出需要辅助线计算的layer
const getLayerBySubLine = (ie: INLEDITOR) => {
  const stage = ie.getStage();
  const thing = layer(stage, "thing");
  const arr: Array<Node<NodeConfig>> = [...thing.children!];
  return arr;
};

// 当前对象的点
const getObjectSnappingEdges = (node: Stage | Shape<ShapeConfig>) => {
  var box = node.getClientRect();
  return {
    vertical: [
      {
        guide: Math.round(box.x),
        offset: Math.round(node.x() - box.x),
        snap: "start",
      },
      {
        guide: Math.round(box.x + box.width / 2),
        offset: Math.round(node.x() - box.x - box.width / 2),
        snap: "center",
      },
      {
        guide: Math.round(box.x + box.width),
        offset: Math.round(node.x() - box.x - box.width),
        snap: "end",
      },
    ],
    horizontal: [
      {
        guide: Math.round(box.y),
        offset: Math.round(node.y() - box.y),
        snap: "start",
      },
      {
        guide: Math.round(box.y + box.height / 2),
        offset: Math.round(node.y() - box.y - box.height / 2),
        snap: "center",
      },
      {
        guide: Math.round(box.y + box.height),
        offset: Math.round(node.y() - box.y - box.height),
        snap: "end",
      },
    ],
  };
};

const getLineGuideStops = (
  stage: Stage,
  skipShape: Stage | Shape<ShapeConfig> | Node<NodeConfig>,
  arr: Array<Node<NodeConfig>>
) => {
  // we can snap to stage borders and the center of the stage
  const vertical: any = [0, stage.width() / 2, stage.width()];
  const horizontal: any = [0, stage.height() / 2, stage.height()];

  // and we snap over edges and center of each object on the canvas
  arr.forEach((guideItem) => {
    if (guideItem === skipShape) {
      return;
    }
    const box = guideItem.getClientRect();
    // and we can snap to all edges of shapes
    vertical.push([box.x, box.x + box.width, box.x + box.width / 2]);
    horizontal.push([box.y, box.y + box.height, box.y + box.height / 2]);
  });
  return {
    vertical: vertical.flat(),
    horizontal: horizontal.flat(),
  };
};

const getGuides = (
  lineGuideStops: {
    vertical: number[];
    horizontal: number[];
  },
  itemBounds: {
    vertical: {
      guide: number;
      offset: number;
      snap: string;
    }[];
    horizontal: {
      guide: number;
      offset: number;
      snap: string;
    }[];
  }
) => {
  const resultV: any = [];
  const resultH: any = [];
  const GUIDELINE_OFFSET = 5;
  lineGuideStops.vertical.forEach((lineGuide) => {
    itemBounds.vertical.forEach((itemBound) => {
      const diff = Math.abs(lineGuide - itemBound.guide);
      // if the distance between guild line and object snap point is close we can consider this for snapping
      if (diff < GUIDELINE_OFFSET) {
        resultV.push({
          lineGuide: lineGuide,
          diff: diff,
          snap: itemBound.snap,
          offset: itemBound.offset,
        });
      }
    });
  });

  lineGuideStops.horizontal.forEach((lineGuide) => {
    itemBounds.horizontal.forEach((itemBound) => {
      const diff = Math.abs(lineGuide - itemBound.guide);
      if (diff < GUIDELINE_OFFSET) {
        resultH.push({
          lineGuide: lineGuide,
          diff: diff,
          snap: itemBound.snap,
          offset: itemBound.offset,
        });
      }
    });
  });

  const guides = [];

  // find closest snap
  const minV = resultV.sort(
    (a: { diff: number }, b: { diff: number }) => a.diff - b.diff
  )[0];
  const minH = resultH.sort(
    (a: { diff: number }, b: { diff: number }) => a.diff - b.diff
  )[0];
  if (minV) {
    guides.push({
      lineGuide: minV.lineGuide,
      offset: minV.offset,
      orientation: "V",
      snap: minV.snap,
    });
  }
  if (minH) {
    guides.push({
      lineGuide: minH.lineGuide,
      offset: minH.offset,
      orientation: "H",
      snap: minH.snap,
    });
  }
  return guides;
};

const drawGuides = (
  ie: INLEDITOR,
  guides: {
    lineGuide: any;
    offset: any;
    orientation: string;
    snap: any;
  }[],
  layer: Konva.Layer,
  themeType: Theme
) => {
  const stage = ie.getStage();
  guides.forEach((lg) => {
    if (lg.orientation === "H") {
      const { x, y } = computedXY(stage, 6000, lg.lineGuide);
      const line = createSubLine(
        {
          points: [x, y, -x, y],
        },
        themeType
      );
      layer.add(line);
    } else if (lg.orientation === "V") {
      const { x, y } = computedXY(stage, lg.lineGuide, -6000);
      const line = createSubLine(
        {
          points: [x, y, x, -y],
        },
        themeType
      );
      layer.add(line);
    }
    layer.batchDraw();
  });
};

export const initSubLine = function (
  this: INLEDITOR,
  stage: Konva.Stage,
  e: KonvaEventObject<any>
) {
  const layerSubLine = layer(this.stage, "util");
  let target = e.target as Shape<ShapeConfig> | Stage | Konva.Transformer;

  getSubLine(layerSubLine, this.theme).forEach((item) => {
    item.destroy();
  });
  if (target === stage) return;

  target = (stage.findOne("Transformer") as Konva.Transformer) || target;

  const useLayer = getLayerBySubLine(this);
  const lineGuideStops = getLineGuideStops(stage, target, useLayer);
  const itemBounds = getObjectSnappingEdges(target as any);
  const guides = getGuides(lineGuideStops, itemBounds);

  if (!guides.length) {
    return;
  }
  drawGuides(this, guides, layerSubLine, this.theme);

  guides.forEach((lg) => {
    switch (lg.snap) {
      case "start": {
        switch (lg.orientation) {
          case "V": {
            target.x(lg.lineGuide + lg.offset);
            break;
          }
          case "H": {
            target.y(lg.lineGuide + lg.offset);
            break;
          }
        }
        break;
      }
      case "center": {
        switch (lg.orientation) {
          case "V": {
            target.x(lg.lineGuide + lg.offset);
            break;
          }
          case "H": {
            target.y(lg.lineGuide + lg.offset);
            break;
          }
        }
        break;
      }
      case "end": {
        switch (lg.orientation) {
          case "V": {
            target.x(lg.lineGuide + lg.offset);
            break;
          }
          case "H": {
            target.y(lg.lineGuide + lg.offset);
            break;
          }
        }
        break;
      }
    }
  });
};

export const closeSubLine = function (this: INLEDITOR) {
  const layerSubLine = layer(this.stage, "util");
  getSubLine(layerSubLine, this.theme).forEach((item) => {
    item.destroy();
  });
  layerSubLine.batchDraw();
};
