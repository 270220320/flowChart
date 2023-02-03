import INLEDITOR from "src";
import initStage from "src/util/initStage";

// export interface Component<T = any> {
//   name: string;
//   version: string;
//   instance: T;
// }

export class Component {
  name = "comp";
  that!: INLEDITOR;
  version = "0.0.1";
  destory() {}
  show() {}
  hide() {}
  init() {}
}

export const useComponent = function (this: INLEDITOR, component: Component) {
  component.that = this;
  component.init();
  this[component.name] = component;
};
