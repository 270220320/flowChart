import Konva from "konva";
import { ComponentFac, useComponent } from "./component/componentFac";
import {
  StoreHouse,
  VideoNode,
  Scale,
  Pool,
  setBeltScale,
  setScraperScale,
} from "./component";
import theme, { Theme } from "./config/theme";
import { groupNames, createThingGroup } from "./element/group";
import { changeThingComponentState, changeThingImage } from "./element/image";
import { createThingTexts } from "./element/text";
import event from "./event";
import stageClick, { getIus, onSelectCallBackFun } from "./event/stageClick";
import changeElementsPosition, {
  AlignType,
} from "./util/changeElementsPosition";
import changeTheme from "./util/changeTheme";
import { getCustomAttrs, getLineInfo } from "./util/customAttr";
import { getRelations, getRelation } from "./util/getRelations";
import initStage from "./util/initStage";
import layer from "./util/layer";
import stageTofit from "./util/stageTofit";
import toImage from "./util/toImage";
import animate from "./animate/line";
import disableMove from "./util/initStage/disableMove";
import { updateLineColor } from "./util/line/line";
import { Thing } from "./data/thing";
import { resetEvent } from "./event/selectItem";
import { exitEditLine } from "./util/line/editLine";
import reset from "./util/initStage/reset";
import { showAnchor } from "./util/anchor";
import { setField } from "./util/element/setField";
import { FieldTheme } from "./config/field";
import { removeRelevance } from "./event/keyDown/remove";
import { getThingImage } from "./util";
import {
  changeLabelState,
  removeTextEle,
  resetTextEle,
  setTextVal,
} from "./element/texts/util";
import { thingTextInfo } from "./data/cdata";

export type DrawState =
  | "Line"
  | "dottedLine"
  | "rightAngleLine"
  | "rightAngleDottedLine"
  | "editLine"
  | "Rect"
  | "Text"
  | "img"
  | "dragStage"
  | "fieldSelect"
  | "default";

interface INLEDITOR {
  [ket: string]: any;
  opt: OPT;
  components: {
    [ket: string]: ComponentFac;
  };
}
enum SpecialCode {
  all = "allOfThem",
}

export type onDropCb = (
  s: Thing,
  p: { x: number; y: number },
  parent?: Konva.Group
) => void;

export type onCreateLineCb = (id: string) => void;

interface OPT {
  id: string;
  onDropCb?: onDropCb;
  onCreateLineCb?: onCreateLineCb;
  onRemoveCb?: () => void;
  onTransform?: () => void;
  isPreview?: boolean;
  json?: string;
  scale?: "show" | "hide";
}
class INLEDITOR {
  constructor(opt: OPT) {
    this.opt = opt;
    // this.init(opt.json);
    // if (opt.isPreview) {
    //   layer(this.stage, "line").moveToBottom();
    // }
  }
  async init(json?: string | null) {
    initStage(this, json);
    // 留存设备画布，避免重复获取，提高性能
    this.thingLayer = layer(this.stage, "thing");
    this.thingLayer.setAttrs({ draggable: false });
    setField(this);
    this.event();
    new ComponentFac(this.stage);
    if (this.opt.scale === "show" && !this.opt.isPreview) {
      this.use(new Scale(this));
    }
    this.use(new Pool(this.stage));
    this.use(new StoreHouse(this.stage));
    this.use(new VideoNode(this.stage));
    this.onStageChange(this);
    if (json) {
      await reset(this);
    }
  }
  // 设备图层
  thingLayer;

  // 皮带刮板组件集合
  componentArr: any[] = [];

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

  setField(stage, height: number, width: number) {
    const field: Konva.Node = stage.find(".field")[0];
    field.setAttrs({
      height,
      width,
    });
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
  // 私有图片url或者虚线，间隔
  drawInfo: { type?: string; url?: string; dotted?: number[] };
  protected stateChangeCb: (state: DrawState) => void | undefined;
  onDrawStateChange(cb: (state: DrawState) => {}) {
    this.stateChangeCb = cb;
  }
  getDrawState() {
    return this.drawState;
  }

  // 设置画状态
  setDrawState(state: DrawState, info?: { type: string; url: string }) {
    this.drawState = state;
    this.drawInfo = info;
    switch (state) {
      case "rightAngleLine":
      case "rightAngleDottedLine":
      case "dottedLine":
      case "Line":
        showAnchor(this.stage, "show");
        break;
    }
    this.stateChangeCb?.(state);
  }
  removeNode = (node: Konva.Group) => {
    node.remove();
    node.children.forEach((ele) => {
      if (ele.name() === "thingImage") {
        removeRelevance(ele, this.stage);
      }
    });
  };
  disableStageMove() {
    disableMove(this.stage);
  }
  // 创建thing文字
  createLineGroup = (line, useThing: Thing) => {
    const group = createThingGroup(useThing, "line" + useThing.iu);
    group.setAttrs({ draggable: false });
    const lineLay = layer(this.stage, "line");
    lineLay.add(group);
    group.add(line);
    return group;
  };
  // 创建thing文字
  createThingText = (iu: string, type?: "thing" | "line") => {
    return createThingTexts(
      this,
      type === "thing" || type === undefined ? iu : type + iu,
      this.theme
    );
  };
  setComponentScale = (iu: string, scale: number) => {
    const thingGroup: Konva.Group = this.stage.findOne("#" + iu);
    const thingImage = getThingImage(thingGroup);
    if (thingImage.attrs.componentName === "BELT") {
      setBeltScale(this, iu, thingGroup, scale);
    } else if (thingImage.attrs.componentName === "Scraper") {
      setScraperScale(this, iu, thingGroup, scale);
    }
  };

  // 修改主题
  changeTheme(themeType: Theme, cb?: (stage: Konva.Stage) => {}) {
    this.theme = themeType;
    this.container.style.background = theme[themeType].background;
    const field: Konva.Node = this.getStage().find(".field")[0];
    field.setAttrs({ fill: FieldTheme[themeType].fill });
    changeTheme(this.stage, themeType, cb);
  }

  // 动态修改物模型的值
  setVal(iu: string, propertyId: string, val: string) {
    setTextVal(this.stage, iu, propertyId, val);
  }

  changeLabel = (iu: string, propertyId: string, val: boolean) => {
    changeLabelState(this.stage, iu, propertyId, val);
  };

  resetText(iu: string, propertyId: string, info: thingTextInfo, type: string) {
    resetTextEle(this, iu, propertyId, info, type);
  }

  resetTexts = (
    arr: { iu: string; propertyId: string; info: thingTextInfo; type: string }[]
  ) => {
    arr.forEach((ele) => {
      const { iu, propertyId, info, type } = ele;
      resetTextEle(this, iu, propertyId, info, type);
    });
  };

  removeText(iu: string, ids: Array<string | SpecialCode.all>) {
    removeTextEle(this.stage, iu, ids);
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
    const thingBox = this.thingLayer.findOne(`#${iu}`);
    const { state } = getCustomAttrs(thingBox);
    return state;
  }
  // 修改设备状态
  async setThingState(iu: string, setStateVal: string | number, src?: string) {
    const thingBox = this.thingLayer.findOne(`#${iu}`);
    const image = (thingBox as Konva.Group)?.findOne(
      ".thingImage"
    ) as Konva.Image;
    const { state } = getCustomAttrs(thingBox);
    if (state === setStateVal) return;
    if (image.getClassName() !== "Image") {
      // 组件处理

      changeThingComponentState(this.stage, image, setStateVal);
    } else {
      image ? await changeThingImage(image, src, setStateVal as string) : null;
    }
  }

  // 注册组件
  use(component: ComponentFac) {
    useComponent(this, component);
  }

  getComponent<T extends ComponentFac>(s: string) {
    return (this.components[s] ? this.components[s] : {}) as T;
  }

  // 序列化
  toJson(source?: string) {
    if (source === "auto" && this.stage.findOne("Transformer")) {
      return { res: false };
    }
    exitEditLine(this.stage);
    resetEvent(this.stage);
    const json = this.stage.toJSON();
    return { mapJson: json, image: this.toImage() };
  }
  deleteAllPoint() {
    this.stage.find("Circle").forEach((point) => {
      point.remove();
    });
  }
  // 反序列化
  async loadJson(json?: string | null, cb?) {
    await this.init(json);
    cb ? cb() : "";
  }

  // 转换成图片
  toImage() {
    return toImage(this.stage, theme[this.theme].background);
  }

  // 通过ID获取已选codes
  getCodeById(iu: string) {
    const thingGroup: Konva.Group = this.stage.findOne("#" + iu);
    return getIus(thingGroup);
  }

  selectCb: onSelectCallBackFun;
  // 当画布元素被选中
  onselect(cb: onSelectCallBackFun) {
    this.selectCb = cb;
    stageClick(this.getStage(), cb);
  }

  // 获取所有关系
  getRelations() {
    return getRelations(this.stage);
  }
  // 获取关系
  getRelation(line) {
    return getRelation(line, this.stage);
  }
  // 修改线颜色，已弃用
  updateLineColor(key, line) {
    updateLineColor(key, line, this.theme);
  }
  // 新版修改线样式
  updateLineOption(line, key, option: { color?: string; dotted?: number[] }) {
    const info = getLineInfo(line);
    info.state = key;
    if (option.color) {
      line.setAttrs({
        stroke: option.color,
        fill: option.color,
      });
    }
    line.setAttrs({
      dash: option.dotted,
    });
  }

  // 适应画布
  toFit() {
    stageTofit(this);
  }

  hasChange = false;

  // 舞台发生变化
  onStageChange = (ie, cb?: () => void) => {
    this.stage.on(
      "resize scale rotate wheel dragmove mouseUp mousedown",
      (e) => {
        if (ie.getDrawState() === "default") {
          return;
        }
        this.hasChange = true;
        // cb();
      }
    );
    this.stage.children.forEach((lay: Konva.Layer) => {
      lay.on("resize scale rotate wheel dragmove mousedown mouseup", () => {
        // cb();
        this.hasChange = true;
      });
    });
    this.container.addEventListener("keydown", () => {
      // cb();
      this.hasChange = true;
    });
    this.container.addEventListener("drop", () => {
      // cb();
      this.hasChange = true;
    });
  };
  changeElementsPosition(type: AlignType) {
    changeElementsPosition(this.getStage(), type);
  }

  render(opt?: { width: number; height: number }) {
    if (opt) {
      this.stage.setAttrs({
        width: opt.width,
        height: opt.height,
      });
      // if (
      //   this.getComponent<Scale>("scale") &&
      //   Object.keys(this.getComponent<Scale>("scale")).length !== 0
      // ) {
      //   this.getComponent<Scale>("scale").render();
      // }
    }
    this.stage.draw();
  }
}

export const Animate = animate;
export default INLEDITOR;
