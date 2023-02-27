import Konva from "konva";
import resetComponent from "./resetComponent";
import resetImg from "./resetImg";
import INLEDITOR from "../../../index";

export default (ie: INLEDITOR) => {
  const stage = ie.getStage();
  resetImg(stage);
  resetComponent(ie);
};
