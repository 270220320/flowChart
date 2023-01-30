import loadsh from "lodash";

export interface Thing {
  iu: string; // instanceUuid
  ic: string; // instanceCode
  img: string;
  name: string;
}

const thing: Thing = {
  ic: "",
  iu: "",
  img: "",
  name: "",
};

export default (customThing: Thing) => {
  return loadsh.cloneDeep(Object.assign({}, thing, customThing));
};
