export const getParentThingGroup = (node) => {
  if (node.name() === "thingGroup" || node.name() === "field") {
    return node;
  } else {
    return getParentThingGroup(node.parent);
  }
};
