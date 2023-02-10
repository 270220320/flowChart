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

export const useComponent = (ie: INLEDITOR, component: Component) => {
  component.that = ie;
  component.init();
  ie[component.name] = component;
};
