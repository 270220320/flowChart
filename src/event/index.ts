import INLEDITOR from "..";
import ondrop from "./ondrop";
import onwheel from "./onwheel";
import keyDown from "./keyDown";
import selectionBox from "./selectionBox";
import selectItem from "./selectItem";
import onDrag from "./onDrag";
import Scale from "src/component/scale";

export default function (this: INLEDITOR) {
  selectionBox(this);
  ondrop(this, this.container, () => {});
  selectItem(this.stage);
  onwheel(this.stage);
  keyDown(this);
  onDrag.bind(this)();
  new Scale({
    ie: this,
  });
}
