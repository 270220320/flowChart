import { getCustomAttrs } from "@/main";

export const resetNodeSize = (stage) => {
  const circles = stage.find("Circle");
  circles.forEach((circle) => {
    if (getCustomAttrs(circle).type === "control") {
      circle.setAttrs({
        radius: 5 / stage.scaleX(),
      });
    }
  });
};
