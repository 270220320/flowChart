export const getParentThingGroup = (node) => {
  if (node.name() === "thingGroup" || node.name() === "field") {
    return node;
  } else {
    return getParentThingGroup(node.parent);
  }
};

export const getParentThingImage = (node) => {
  if (node.name() === "thingImage") {
    return node;
  } else {
    return getParentThingImage(node.parent);
  }
};
