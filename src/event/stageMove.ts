import INLEDITOR from "..";

export default (ie: INLEDITOR) => {
  ie.container.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
      ie.stage.setAttr("draggable", true);
    }
  });

  ie.container.addEventListener("keyup", (e) => {
    if (e.code === "Space") {
      ie.stage.setAttr("draggable", false);
    }
  });
};
