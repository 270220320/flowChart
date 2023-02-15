import Konva from "konva";
import { Component, useComponent } from "./component";
import Scale from "./component/scale";
import theme, { Theme } from "./config/theme";
import { getThingTextGroup, groupNames } from "./element/group";
import { changeImage } from "./element/image";
import { createThingText, setThingTextVal } from "./element/text";
import event from "./event";
import { getTran } from "./event/selectItem";
import stageClick, { onSelectCallBackFun } from "./event/stageClick";
import changeElementsPosition, {
  AlignType,
} from "./util/changeElementsPosition";
import changeTheme from "./util/changeTheme";
import { getCustomAttrs, setCustomAttrs } from "./util/customAttr";
import { getRelations } from "./util/getRelations";
import initStage from "./util/initStage";
import layer from "./util/layer";
import stageTofit from "./util/stageTofit";
import toImage from "./util/toImage";
import animate from "./animate";

type DrawState = "Line" | "rightAngleLine" | "editLine" | "Rect" | "default";

interface INLEDITOR {
  [ket: string]: any;
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
  protected init(json?: string) {
    initStage(this, json);
    this.event();
    if (this.opt.scale !== "show" && !this.opt.isPreview) {
      this.use(new Scale({}));
    }
  }

  // 主题
  protected theme: Theme = "dark";
  getTheme() {
    return this.theme;
  }

  // 注册时间
  protected event() {
    event(this);
  }

  protected stage: Konva.Stage;

  getStage() {
    return this.stage || null;
  }
  setStage(c: Konva.Stage) {
    this.stage = c;
  }

  protected container: HTMLDivElement;
  getContainer() {
    return this.container || null;
  }
  setContainer(c: HTMLDivElement) {
    this.container = c;
  }
  // 绘制状态
  protected drawState:
    | "Line"
    | "rightAngleLine"
    | "editLine"
    | "Rect"
    | "default" = "default";
  getDrawState() {
    return this.drawState;
  }
  setDrawState(state: DrawState) {
    this.drawState = state;
  }

  // 创建thing文字
  createThingText = (iu: string) => {
    return createThingText(this.stage, iu, this.theme);
  };

  // 修改主题
  changeTheme(themeType: Theme, cb?: (stage: Konva.Stage) => {}) {
    this.theme = themeType;
    this.container.style.background = theme[themeType].background;
    changeTheme(this.stage, themeType, cb);
  }

  // 动态修改物模型的值
  setVal(iu: string, code: string, val: string) {
    // 查找物模型
    const thignGroup = layer(this.stage, "thing").findOne(
      `#${iu}`
    ) as Konva.Group;
    if (!thignGroup) return;
    // 筛选code
    getThingTextGroup(thignGroup).forEach((e) => {
      if (e.attrs.code && e.attrs.code === code) {
        setThingTextVal(e, val);
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
  use(component: Component) {
    useComponent(this, component);
  }

  // 序列化
  toJson() {
    const json = this.stage.toJSON();
    return { mapJson: json, image: this.toImage() };
  }
  // 反序列化
  loadJson(json: string) {
    this.init(json);
  }

  // 转换成图片
  toImage() {
    return toImage(this.stage, theme[this.theme].background);
  }

  // 当画布元素被选中
  onselect(cb: onSelectCallBackFun) {
    stageClick(this.stage, cb);
  }

  // 获取所有关系
  getRelations() {
    return getRelations(this.stage);
  }

  // 适应画布
  toFit() {
    stageTofit(this.stage);
  }

  // 舞台发生变化
  onStageChange(cb: () => void) {
    this.stage.on("resize scale rotate wheel dragmove mouseUp", () => {
      cb();
    });
    this.container.addEventListener("keydown", () => {
      cb();
    });
    this.container.addEventListener("drop", () => {
      cb();
    });
  }

  changeElementsPosition(type: AlignType) {
    console.log(getTran(this.stage).Transformers.getNode());
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

export const Animate = animate;
export default INLEDITOR;
