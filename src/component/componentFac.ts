import INLEDITOR from "..";
import Konva from "konva";
import layer from "@/util/layer";
import { UUID } from "@/util/uuid";
import { createComponentThingGoup } from "@/element";
import { Thing } from "@/data/thing";

type EditorCom = {
  thingGroup?: Konva.Group;
  imgGroup?: Konva.Group;
};

export class ComponentFac {
  name = "comp";
  editor!: INLEDITOR;
  version = "0.0.1";
  stage;
  constructor(stage) {
    this.stage = stage;
  }
  product(
    position: { x: number; y: number },
    size: { width: number; height: number },
    thingInfo?: Thing
  ) {
    const editorCom: EditorCom = {};
    const lay = layer(this.stage, "thing");
    editorCom.imgGroup = new Konva.Group({
      ...position,
      ...size,
      draggable: false,
      name: "thingImage",
      componentName: this.name,
      id: UUID(),
    });
    editorCom.thingGroup = createComponentThingGoup(
      lay,
      thingInfo,
      editorCom.imgGroup
    );
    return editorCom;
  }
}

export const useComponent = (ie: INLEDITOR, component: ComponentFac) => {
  component.editor = ie;
  // component.init(ie.getStage());
  if (!ie.components) {
    ie.components = {};
  }
  ie.components[component.name] = component;
};
