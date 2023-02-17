import Konva from "konva";
import resetComponent from "./resetComponent";
import resetImg from "./resetImg";

export default (stage: Konva.Stage) => {
  resetImg(stage);
  resetComponent(stage);
};
