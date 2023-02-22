import Konva from "konva";
import { Component, useComponent } from "./component/component";
import Scale from "./component/scale";
import theme, { Theme } from "./config/theme";
import { getThingTextGroup, groupNames } from "./element/group";
import { changeThingComponentState, changeThingImage } from "./element/image";
import { createThingText, setThingTextVal } from "./element/text";
import event from "./event";
import stageClick, { onSelectCallBackFun } from "./event/stageClick";
import changeElementsPosition, {
  AlignType,
} from "./util/changeElementsPosition";
import changeTheme from "./util/changeTheme";
import { getCustomAttrs } from "./util/customAttr";
import { getRelations, getRelation } from "./util/getRelations";
import initStage from "./util/initStage";
import layer from "./util/layer";
import stageTofit from "./util/stageTofit";
import toImage from "./util/toImage";
import animate from "./animate/line";
import disableMove from "./util/initStage/disableMove";
import { updateLineColor } from "./util/line/line";
import { Thing } from "./data/thing";
import { clearTransFormer } from "./event/selectItem";
import { exitEditLine } from "./util/line/editLine";

export type DrawState =
  | "Line"
  | "dottedLine"
  | "rightAngleLine"
  | "rightAngleDottedLine"
  | "editLine"
  | "Rect"
  | "Text"
  | "default";

interface INLEDITOR {
  [ket: string]: any;
  opt: OPT;
  components: {
    [ket: string]: Component;
  };
}

export type onDropCb = (
  s: Thing,
  p: { x: number; y: number },
  parent?: Konva.Group
) => void;

interface OPT {
  id: string;
  onDropCb?: onDropCb;
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
  protected drawState: DrawState = "default";
  getDrawState() {
    return this.drawState;
  }
  setDrawState(state: DrawState) {
    this.drawState = state;
  }

  disableStageMove() {
    disableMove(this.stage);
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
  //查询设备状态
  getThingState(iu: string) {
    const thingLayer = layer(this.stage, "thing");
    const thingBox = thingLayer.findOne(`#${iu}`);
    const { state } = getCustomAttrs(thingBox);
    return state;
  }
  // 修改设备状态
  setThingState(iu: string, setStateVal: string | number, src?: string) {
    const thingLayer = layer(this.stage, "thing");
    const thingBox = thingLayer.findOne(`#${iu}`);
    const image = (thingBox as Konva.Group)?.findOne(
      ".thingImage"
    ) as Konva.Image;

    const { state } = getCustomAttrs(thingBox);
    if (state === setStateVal) return;
    if (image.getClassName() !== "Image") {
      // 组件处理

      changeThingComponentState(this.stage, image, setStateVal);
    } else {
      image ? changeThingImage(image, src, setStateVal as string) : null;
    }
  }

  // 注册组件
  use(component: Component) {
    useComponent(this, component);
  }

  getComponent<T = Component>(s: string) {
    return (this.components[s] ? this.components[s] : {}) as T;
  }

  // 序列化
  toJson() {
    const json = this.stage.toJSON();
    exitEditLine(this.stage);
    clearTransFormer(this.stage);
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
  // 获取关系
  getRelation(line) {
    return getRelation(line, this.stage);
  }
  updateLineColor(key, line) {
    updateLineColor(key, line, this.theme);
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
    changeElementsPosition(this.getStage(), type);
  }

  render(opt?: { width: number; height: number }) {
    if (opt) {
      this.stage.setAttrs({
        width: opt.width,
        height: opt.height,
      });
      if (this.getComponent<Scale>("scale")) {
        this.getComponent<Scale>("scale").render();
      }
    }
    this.stage.draw();
  }
}

export const Animate = animate;
export default INLEDITOR;
