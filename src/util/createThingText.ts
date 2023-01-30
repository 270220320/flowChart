import Konva from "konva";
import INLEDITOR from "src";
import { createThingText, createThingDefaultText } from "src/config/thing.text";

export default function (this: INLEDITOR, iu: string, code: string) {
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
        code,
        draggable: true,
      });
    },
    advanced: (data: { labelv: string; value: string; unitval: string }) => {
      const { labelv, value, unitval } = data;
      const group = createThingText(this.theme, { labelv, value, unitval });
      group.setAttrs({
        x: thing.attrs.x,
        y: thing.attrs.y + thing.height(),
        code,
      });
      thingGroup.add(group);
    },
  };
}
