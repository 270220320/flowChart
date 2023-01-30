import Konva from "konva";
import { Group } from "konva/lib/Group";
import theme, { Theme } from "./config/theme";
import { createThingText } from "./config/thing.text";
import event from "./event";
import test from "./test";
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

    // test(this);
  }

  theme: Theme = "dark";

  event = event.bind(this);

  drawState: "line" | "rect" | "selection" = "rect";

  createThingText(iu: string, labelv: string, value: string, unitval: string) {
    const thingGroup = this.stage.findOne(`#${iu}`) as Konva.Group;
    if (!thingGroup) return;
    const thing = thingGroup.findOne("Image") as Konva.Image;
    const group = createThingText(this.theme, labelv, value, unitval);
    group.setAttrs({
      x: thing.attrs.x,
      y: thing.attrs.y + thing.height(),
    });
    thingGroup.add(group);
  }

  changeTheme(themeType: Theme, callBack?: (stage: Konva.Stage) => {}) {
    this.stage.find(".thingTextGroup").forEach((e) => {
      const { labelv, unitval, val, x, y } = e.attrs;
      const parent = e.getParent();
      e.remove();
      parent.add(createThingText(themeType, labelv, val, unitval, { x, y }));
    });
    this.container.style.background = theme[themeType].background;
    // 可以由用户自己控制主题特定项目
    if (callBack) callBack(this.stage);
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
