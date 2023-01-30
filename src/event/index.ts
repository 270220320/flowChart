import INLEDITOR from "..";
import ondrop from "./ondrop";
import onwheel from "./onwheel";
import selectionBox from "./selectionBox";
import selectItem from "./selectItem";

export default function (this: INLEDITOR) {
  selectionBox(this);
  ondrop(this, this.container, () => {});
  selectItem(this.stage);
  onwheel(this.stage);
}
