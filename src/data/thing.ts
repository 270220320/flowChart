import loadsh from "lodash";

interface Thing {
  iu: string;
  ic: string;
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
