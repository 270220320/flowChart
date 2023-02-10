import INLEDITOR from "../";

// export interface Component<T = any> {
//   name: string;
//   version: string;
//   instance: T;
// }

export class Component {
  name = "comp";
  editor!: INLEDITOR;
  version = "0.0.1";
  destory() {}
  show() {}
  hide() {}
  init() {}
}

export const useComponent = (ie: INLEDITOR, component: Component) => {
  component.editor = ie;
  component.init();
  ie[component.name] = component;
};
