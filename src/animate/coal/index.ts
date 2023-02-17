import layer from "@/util/layer";
import Konva from "konva";

interface COALANIM {
  autoPlay: boolean;
  animEl: Konva.Node;
  stage: Konva.Stage;
  animGroup: Konva.Group;
}
class COALANIM {
  constructor(stage: Konva.Stage, uuid: string, autoPlay?: boolean) {
    this.autoPlay = autoPlay || false;
    this.stage = stage;
    this.reset(uuid);

    if (autoPlay) {
      this.start();
    }
  }
  reset(uuid: string) {
    this.animEl = layer(this.stage, "thing").findOne(`#${uuid}`);
    const { x, y, width, height } = this.animEl.getAttrs();
    console.log(x, y, width, height);
    // this.animGroup = new Konva.Group({});
  }
  start() {}
}
export default COALANIM;
