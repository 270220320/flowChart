import Konva from "konva";
import INLEDITOR from "src";
import { createThingTextGroupData } from "src/element/group";
import {
  createThingAdvancedText,
  createThingDefaultText,
} from "src/element/text";

export default function (this: INLEDITOR, iu: string) {
  const thingGroup = this.stage.findOne(`#${iu}`) as Konva.Group;
  if (!thingGroup) return;
  const thing = thingGroup.findOne("Image") as Konva.Image;
  return {
    def: (text: string, code: string) => {
      const textShape = createThingDefaultText(this.theme, { text, code });
      thingGroup.add(textShape);
      textShape.setAttrs({
        x: thing.attrs.x,
        y: thing.attrs.y + thing.height(),
        draggable: true,
      });
    },
    advanced: (data: createThingTextGroupData) => {
      const { labelv, value, unitval, code } = data;
      const group = createThingAdvancedText(this.theme, {
        labelv,
        value,
        unitval,
        code,
        x: thing.attrs.x,
        y: thing.attrs.y + thing.height(),
      });
      thingGroup.add(group);
    },
  };
}
