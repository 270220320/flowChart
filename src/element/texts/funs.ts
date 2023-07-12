import { groupNames } from "../group";
import complexText from "./complexText";
import inputText from "./inputText";
import switchText from "./switchText";

const changeValFun = {};
changeValFun[groupNames.thingTextGroup] = complexText.changeVal;
changeValFun[groupNames.thingInputGroup] = inputText.changeVal;
changeValFun[groupNames.thingSwitchGroup] = switchText.changeVal;
export const changeValFuns = changeValFun;
