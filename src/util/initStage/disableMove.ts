import Konva from "konva";

export default (stage: Konva.Stage) => {
  function a(as: Konva.Layer | Konva.Group) {
    for (let i of as.getChildren()) {
      const draggable = i.getAttr("draggable") || false;
      if (draggable) {
        i.draggable(false);
      }
      if (i.hasChildren()) {
        a(i as any);
      }
    }
  }
};
