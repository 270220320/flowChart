import Konva from "konva";
import { Group } from "konva/lib/Group";
import theme, { Theme } from "./config/theme";
import { getThingTextGroup } from "./config/thing.group";
import event from "./event";
import changeTheme from "./util/changeTheme";
import createThingText from "./util/createThingText";
import { getCustomAttrs, setCustomAttrs } from "./util/customAttr";
import initStage from "./util/initStage";
import layer from "./util/layer";

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

  // 动态修改物模型的值
  setVal(iu: string, code: string, val: string) {
    // 查找物模型
    const thignGroup = layer(this, "thing").findOne(`#${iu}`) as Konva.Group;
    // 筛选code
    getThingTextGroup(thignGroup).forEach((e) => {
      if (e.attrs.code && e.attrs.code === code) {
        setCustomAttrs(e, { val });
        const valNode = e.findOne(".val");
        valNode.setAttr("text", val);
      }
    });
  }

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
