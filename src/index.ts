import Konva from "konva";
import theme, { Theme } from "./config/theme";
import event from "./event";
import changeTheme from "./util/changeTheme";
import createThingText from "./util/createThingText";
import initStage from "./util/initStage";

interface INLEDITOR {
  stage: Konva.Stage;
  container: HTMLDivElement;
  opt: OPT;
}

interface OPT {
  id: string;
}
class INLEDITOR {
  constructor(opt: OPT) {
    this.opt = opt;
    this.init();
  }
  init(json?: string) {
    const { id } = this.opt;
    const { stage, container } = initStage.bind(this)(id, json);
    this.stage = stage;
    this.container = container;

    this.event();
  }

  theme: Theme = "dark";

  event = event.bind(this);

  drawState: "line" | "rect" | "selection" = "selection";

  createThingText = createThingText.bind(this);

  // 修改主题
  changeTheme = changeTheme.bind(this);

  // 序列化
  toJson() {
    return this.stage.toJSON();
  }
  // 反序列化
  loadJson(json: string) {
    this.init(json);
  }
}

export default INLEDITOR;
