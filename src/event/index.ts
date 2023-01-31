import INLEDITOR from "..";
import ondrop from "./ondrop";
import onwheel from "./onwheel";
import keyDown from "./keyDown";
import selectionBox from "./selectionBox";
import selectItem from "./selectItem";
import onDrag from "./onDrag";

export default function (this: INLEDITOR) {
  selectionBox(this);
  ondrop(this, this.container, () => {});
  selectItem(this.stage);
  onwheel(this.stage);
  keyDown(this);
  onDrag.bind(this)();
}
