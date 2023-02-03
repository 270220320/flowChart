import Konva from "konva";
import { Shape, ShapeConfig } from "konva/lib/Shape";
import { Component, useComponent } from "./component";
import Scale from "./component/scale";
import { Theme } from "./config/theme";
import { getThingTextGroup } from "./element/group";
import event from "./event";
import changeTheme from "./util/changeTheme";
import createThingText from "./util/createThingText";
import { getCustomAttrs, setCustomAttrs } from "./util/customAttr";
import initStage from "./util/initStage";
import layer from "./util/layer";

interface INLEDITOR {
  [ket: string]: any;
  stage: Konva.Stage;
  container: HTMLDivElement;
  opt: OPT;
  scale: Scale;
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
    this.use(new Scale({}));
  }

  theme: Theme = "dark";

  event = event.bind(this);

  drawState: "Line" | "rightAngleLine" | "editLine" | "Rect" | "selection" =
    "selection";

  createThingText = createThingText.bind(this);

  // 修改主题
  changeTheme = changeTheme.bind(this);

  // 动态修改物模型的值
  setVal(iu: string, code: string, val: string) {
    // 查找物模型
    const thignGroup = layer(this.stage, "thing").findOne(
      `#${iu}`
    ) as Konva.Group;
    // 筛选code
    getThingTextGroup(thignGroup).forEach((e) => {
      if (e.attrs.code && e.attrs.code === code) {
        setCustomAttrs(e, { val });
        const valNode = e.findOne(".val");
        valNode.setAttr("text", val);
      }
    });
  }

  use = useComponent.bind(this);

  // 序列化
  toJson() {
    return this.stage.toJSON();
  }
  // 反序列化
  loadJson(json: string) {
    this.init(json);
  }

  // 当画布元素被选中
  onselect(
    cb: (
      type: "thing" | "shape" | "thingText",
      e: Konva.Group | Konva.Rect | Shape<ShapeConfig> | Konva.Stage,
      data?: { iu?: string; code?: string; attrs?: Konva.NodeConfig }
    ) => void
  ) {
    this.stage.on("click", (e) => {
      if (e.target !== this.stage) {
        // 如果是图形或者是文字，那么父级别肯定是layer
        let parent = e.target.getParent() as Konva.Layer | Konva.Group;
        // 如果是父级不是layer那就有可能是thing或者是thingText

        if (parent.getClassName() === "Layer") {
          cb("shape", e.target, {
            attrs: e.target.getAttrs(),
          });
        } else {
          const name = parent.name();
          switch (name) {
            case "thingGroup":
              const data1 = getCustomAttrs(parent);

              cb("thing", parent, { iu: data1.thing!.iu });
              break;
            default:
              parent = parent.getParent() as any;
              const data = getCustomAttrs(parent);
              cb("thingText", parent, {
                iu: data.thing!.iu,
                code: data.thing!.tc,
              });
          }
        }
      }
    });
  }
}

export default INLEDITOR;
