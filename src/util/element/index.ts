export const getParentThingGroup = (node) => {
    if (node.name() === "thingGroup") {
      return node;
    } else {
      return getParentThingGroup(node.parent);
    }
  };