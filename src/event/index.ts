import INLEDITOR from "..";
import ondrop from "./ondrop";
import onwheel from "./onwheel";
import keyDown from "./keyDown";
import setDrawState from "./setDrawState";
import selectItem from "./selectItem";
import onDrag from "./onDrag";
import onDbclick from "./dbclick";

export default (ie: INLEDITOR) => {
  const container = ie.getContainer();
  const stage = ie.getStage();

  if (!ie.opt.isPreview) {
    setDrawState(ie);

    ondrop(ie, container);

    selectItem(ie);

    keyDown(ie);

    onDrag(ie);
    onDbclick(ie);
  }
  onwheel(ie);
};
