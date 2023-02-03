import loadsh from "lodash";

export interface Thing {
  iu: string; // instanceUuid
  tc: string; // instanceCode
  img: string;
  name: string;
}

const thing: Thing = {
  tc: "",
  iu: "",
  img: "",
  name: "",
};

export default (customThing: Thing) => {
  return loadsh.cloneDeep(Object.assign({}, thing, customThing));
};
