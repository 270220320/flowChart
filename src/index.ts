import type Konva from "konva";
import event from "./event";
import test from "./test";
import initStage from "./util/initStage";

interface INLEDITOR {
  stage: Konva.Stage;
  container: HTMLDivElement;
  opt: OPT;
}

interface OPT {
  id: string;
}
class INLEDITOR {
  constructor(opt: OPT) {
    this.opt = opt;
    this.init();
  }
  init() {
    const { id } = this.opt;
    const { stage, container } = initStage(id);
    this.stage = stage;
    this.container = container;

    this.event();

    test(this);
  }
  event = event.bind(this);

  drawState: "line" | "rect" | "selection" = "rect";
}

export default INLEDITOR;
