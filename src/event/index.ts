import INLEDITOR from "..";
import ondrop from "./ondrop";
import selectionBox from "./selectionBox";
import selectItem from "./selectItem";
import stageMove from "./stageMove";

export default function (this: INLEDITOR) {
  stageMove(this);
  selectionBox(this);
  ondrop(this, this.container, () => {});
  selectItem(this.stage);
}
