import { isComponentChildren } from "@/component";
import Konva from "konva";
import INLEDITOR from "..";
import layer from "./layer";

export const fileToBase64 = (files: FileList) => {
  const promises = [];
  for (let i = 0; i < files.length; i++) {
    const file = files.item(i);
    if (file) {
      promises.push(
        new Promise((res, rej) => {
          try {
            let fileRead = new FileReader();
            fileRead.readAsDataURL(file);
            fileRead.onload = (data) => {
              res(data.target.result);
            };
          } catch (error) {
            rej(error);
          }
        })
      );
    }
  }
  return Promise.all(promises);
};

export const getMouseOver = (
  point: { x: number; y: number },
  stage: Konva.Stage
) => {
  let node: Konva.Node = layer(stage, "thing").getIntersection(point);

  if (isComponentChildren(node)) {
    return node.parent;
  }
  return node;
};
