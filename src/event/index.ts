import INLEDITOR from "..";
import ondrop from "./ondrop";
import onwheel from "./onwheel";
import keyDown from "./keyDown";
import setDrawState from "./setDrawState";
import selectItem from "./selectItem";
import onDrag from "./onDrag";
import onDbclick from "./dbclick";
import change from "./change";

export default (ie: INLEDITOR) => {
  const container = ie.getContainer();
  const stage = ie.getStage();

  if (!ie.opt.isPreview) {
    setDrawState(ie, () => {
      change(ie);
    });

    ondrop(ie, container, () => {
      change(ie);
    });

    selectItem(ie);

    keyDown(ie, () => {
      change(ie);
    });

    onDrag(ie, () => {
      change(ie);
    });
    onDbclick(ie);
  }
  onwheel(stage, () => {
    change(ie);
  });
};
