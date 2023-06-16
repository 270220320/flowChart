import loadsh from "lodash";

export interface Thing {
  iu: string; // instanceUuid
  ic: string; // instanceCode
  tc: string;
  img?: string;
  fullImg?: string;
  name: string;
  type?: string;
  id?: string;
}

const thing: Thing = {
  tc: "",
  iu: "",
  ic: "",
  img: "",
  name: "",
};

export default (customThing: Thing) => {
  return loadsh.cloneDeep(Object.assign({}, thing, customThing));
};
