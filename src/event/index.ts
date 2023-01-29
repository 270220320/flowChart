import INLEDITOR from "..";
import selectionBox from "./selectionBox";
import stageMove from "./stageMove";

export default function (this: INLEDITOR) {
  stageMove(this);
  selectionBox(this);
}
