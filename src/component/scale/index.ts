import INLEDITOR from "src";
import { createScaleGroup } from "src/config/scale";

interface ScaleOpt {
  ie: INLEDITOR;
}

interface Scale {
  opt: ScaleOpt;
}

class Scale {
  constructor(opt: ScaleOpt) {
    this.opt = opt;
    this.init();
  }
  init() {
    createScaleGroup(this.opt.ie);
  }
  destroy() {}
}

export default Scale;
