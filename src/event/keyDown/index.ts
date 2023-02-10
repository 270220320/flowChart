import INLEDITOR from "@/index";
import remove from "./remove";

export default (ie: INLEDITOR, cb?: () => void) => {
  const container = ie.getContainer();
  container.addEventListener("keydown", (e) => {
    if (e.code === "Backspace" || e.code === "Delete") {
      remove(ie, e);
    }
    cb ? cb() : null;
  });
};
