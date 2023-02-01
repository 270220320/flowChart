import INLEDITOR from "src";
import layer from "src/util/layer";

export default (ie: INLEDITOR) => {
  layer(ie, "line").on("dbclick", () => {});
};
