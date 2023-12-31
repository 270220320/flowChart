import Konva from "konva";
import resetComponent from "./resetComponent";
import resetImg from "./resetImg";
import resetText from "./resetText";
import INLEDITOR from "../../../index";
import { resetLine } from "@/util/line/border";

export default async (ie: INLEDITOR) => {
  const stage = ie.getStage();
  await resetImg(stage);
  resetLine(ie);
  resetText(stage);
  resetComponent(ie);
};
