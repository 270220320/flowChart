import Konva from "konva";
import INLEDITOR from "src";
import { createThingTextGroupData } from "src/config/thing.group";
import { createThingText, createThingDefaultText } from "src/config/thing.text";

export default function (this: INLEDITOR, iu: string) {
  const thingGroup = this.stage.findOne(`#${iu}`) as Konva.Group;
  if (!thingGroup) return;
  const thing = thingGroup.findOne("Image") as Konva.Image;
  return {
    def: (text: string) => {
      const textShape = createThingDefaultText(this.theme, { text });
      thingGroup.add(textShape);
      textShape.setAttrs({
        x: thing.attrs.x,
        y: thing.attrs.y + thing.height(),
        draggable: true,
      });
    },
    advanced: (data: createThingTextGroupData) => {
      const { labelv, value, unitval, code } = data;
      const group = createThingText(this.theme, {
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
