import Konva from "konva";
import { Shape, ShapeConfig } from "konva/lib/Shape";
import { Component, useComponent } from "./component";
import Scale from "./component/scale";
import { Theme } from "./config/theme";
import { getThingTextGroup, groupNames } from "./element/group";
import { changeImage } from "./element/image";
import event from "./event";
import stageClick from "./event/stageClick";
import changeTheme from "./util/changeTheme";
import createThingText from "./util/createThingText";
import { getCustomAttrs, setCustomAttrs } from "./util/customAttr";
import initStage from "./util/initStage";
import layer from "./util/layer";
import stageTofit from "./util/stageTofit";

interface INLEDITOR {
  [ket: string]: any;
  stage: Konva.Stage;
  container: HTMLDivElement;
  opt: OPT;
  scale: Scale;
}

interface OPT {
  id: string;
  isPreview?: boolean;
  json?: string;
  scale?: "show" | "hide";
}
class INLEDITOR {
  constructor(opt: OPT) {
    this.opt = opt;
    this.init(opt.json);
  }
  init(json?: string) {
    const { id } = this.opt;
    const { stage, container } = initStage.bind(this)(id, json);
    this.stage = stage;
    this.container = container;
    this.event();

    if (this.opt.scale !== "show" && !this.opt.isPreview) {
      this.use(new Scale({}));
    }
  }

  // 主题
  theme: Theme = "dark";

  // 注册时间
  event = event.bind(this);

  // 绘制状态
  drawState: "Line" | "rightAngleLine" | "editLine" | "Rect" | "default" =
    "default";
  // 保存状态
  saveState: boolean = true;
  // 设置保存状态
  changeSaveStage(v: boolean) {
    this.saveState = v;
  }

  // 创建thing文字
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
  // 删除thing文字
  removeText(iu: string, code: string) {
    // 查找物模型
    const thignGroup = layer(this.stage, "thing").findOne(
      `#${iu}`
    ) as Konva.Group;
    // 筛选code
    getThingTextGroup(thignGroup).forEach((e) => {
      const attrs = e.getAttrs();
      if (attrs.code && attrs.code === code) {
        e.remove();
      }
    });
  }

  // 获取画布上所有物模型的id
  getAllIus() {
    const thingLayer = layer(this.stage, "thing");
    thingLayer.draw();
    const ius: Array<string> = [];
    thingLayer.getChildren().forEach((e) => {
      if (e.hasName(groupNames.thingGroup)) {
        const { iu } = getCustomAttrs(e).thing!;
        ius.push(iu);
      }
    });
    return ius;
  }

  // 动态修改图片
  changeImage(iu: string, src: string) {
    const thingLayer = layer(this.stage, "thing");

    const image = (thingLayer.findOne(`#${iu}`) as Konva.Group)?.findOne(
      "Image"
    ) as Konva.Image;
    image ? changeImage(image, src) : null;
  }

  // 注册组件
  use = useComponent.bind(this);

  // 序列化
  toJson() {
    const json = this.stage.toJSON();
    return json;
  }
  // 反序列化
  loadJson(json: string) {
    this.init(json);
  }

  // 当画布元素被选中
  onselect = stageClick.bind(this);

  // 适应画布
  toFit() {
    stageTofit(this.stage);
  }

  render(opt?: { width: number; height: number }) {
    if (opt) {
      this.stage.setAttrs({
        width: opt.width,
        height: opt.height,
      });
      if (this.scale) {
        this.scale.render();
      }
    }
    this.stage.draw();
  }
}

export default INLEDITOR;
