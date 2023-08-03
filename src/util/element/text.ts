export const changeTextLabel = (textGroup, state) => {
  const label = textGroup.children.find((ele) => ele.name() === "label");
  if (state) {
    label.visible(true);
    const width = label.width() + 5;
    textGroup.children.forEach((ele) => {
      if (ele.name() !== "label") {
        ele.setAttrs({ x: ele.x() + width });
      }
    });
  } else {
    const width = label.width() + 5;
    textGroup.children.forEach((ele) => {
      if (ele.name() !== "label") {
        ele.setAttrs({ x: ele.x() - width });
      }
    });
    label.visible(false);
  }
};
