import INLEDITOR from "..";
import ondrop from "./ondrop";
import onwheel from "./onwheel";
import keyDown from "./keyDown";
import selectionBox from "./selectionBox";
import selectItem from "./selectItem";
import onDrag from "./onDrag";
import Scale from "src/component/scale";
import layer from "src/util/layer";

export default function (this: INLEDITOR) {
  const scaleComponent = new Scale({
    ie: this,
  });
  selectionBox(this);
  ondrop(this, this.container, () => {});
  selectItem(this.stage);
  onwheel(this.stage);
  keyDown(this);
  onDrag.bind(this)();
}
