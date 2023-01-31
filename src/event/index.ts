import INLEDITOR from "..";
import ondrop from "./ondrop";
import onwheel from "./onwheel";
import keyDown from "./keyDown";
import selectionBox from "./selectionBox";
import selectItem from "./selectItem";
import subline from "./subline";

export default function (this: INLEDITOR) {
  selectionBox(this);
  ondrop(this, this.container, () => {});
  selectItem(this.stage);
  onwheel(this.stage);
  subline.bind(this)();
  keyDown(this);
}
