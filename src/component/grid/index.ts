import { ComponentFac } from "../componentFac";

interface GridOpt {}
export default class Grid extends ComponentFac {
  constructor(opt: GridOpt) {
    super();
  }
  name = "grid";
}
