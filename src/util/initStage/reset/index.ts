import Konva from "konva";
import resetComponent from "./resetComponent";
import resetImg from "./resetImg";
import resetText from "./resetText";
import INLEDITOR from "../../../index";

export default async (ie: INLEDITOR) => {
  const stage = ie.getStage();
  await resetImg(stage);
  resetText(stage);
  resetComponent(ie);
};
