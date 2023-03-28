import { BELT, Pool, VideoNode, Scraper } from "@/component";
import { getCustomAttrs } from "@/util/customAttr";
import layer from "@/util/layer";
import Konva from "konva";
import INLEDITOR from "../../../index";

export default (ie: INLEDITOR) => {
  const thingLayer = layer(ie.getStage(), "thing");
  thingLayer.find(".thingImage").forEach((item) => {
    const { componentName } = item.getAttrs();
    const { thing } = getCustomAttrs(item.parent);
    if (componentName && componentName === "belt") {
      new BELT(ie.getStage(), { thingInfo: thing });
    }
    if (componentName && componentName === "scraper") {
      new Scraper(ie.getStage(), { thingInfo: thing });
    }
    if (componentName && componentName === "pool") {
      const pool: Pool = ie.getComponent("pool");
      pool.add(thing, undefined, item.parent as Konva.Group);
    }
    if (componentName && componentName === "storeHouse") {
      const pool: Pool = ie.getComponent("storeHouse");
      pool.add(thing, undefined, item.parent as Konva.Group);
    }
    if (componentName && componentName === "video") {
      const video: VideoNode = ie.getComponent("video");
      video.add(thing, undefined, ie.opt.isPreview, item.parent as Konva.Group);
    }
  });
};
