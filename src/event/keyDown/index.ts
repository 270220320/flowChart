import INLEDITOR from "src";
import remove from "./remove";

export default (ie: INLEDITOR) => {
  ie.container.addEventListener("keydown", (e) => {
    if (e.code === "Backspace" || e.code === "Delete") {
      remove(ie, e);
    }
  });
};
