import Konva from "konva";
import resetComponent from "./resetComponent";
import resetImg from "./resetImg";
import INLEDITOR from "../../../index";

export default async (ie: INLEDITOR) => {
  const stage = ie.getStage();
  await resetImg(stage);
  resetComponent(ie);
};
