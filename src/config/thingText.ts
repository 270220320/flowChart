import Konva from "konva";
import { Theme } from "./theme";

export interface ThingTextType {
  def: { val: Konva.NodeConfig };
  advanced: {
    val: Konva.NodeConfig;
    unit: Konva.NodeConfig;
    label: Konva.NodeConfig;
  };
}

export const ThingText: Record<Theme, ThingTextType> = {
  light: {
    def: {
      val: {
        fill: "#354052",
        size: 14,
      },
    },
    advanced: {
      val: {
        fill: "#5C667D",
        size: 14,
        rectFill: "#FFFFFF",
        rectStroke: "#B9C2D5",
        rectHeight: 24,
        rectWidth: 47,
      },
      unit: {
        fill: "#5C667D",
        size: 12,
        opacity: 0.5,
      },
      label: {
        fill: "#5C667D",
        size: 14,
      },
    },
  },
  dark: {
    def: {
      val: {
        fill: "#9CA9C7",
        size: 14,
      },
    },
    advanced: {
      val: {
        fill: "#33DAFF",
        size: 14,
        rectFill: "#2A6BDB",
        rectStroke: "#1D56A1",
        rectHeight: 24,
        rectWidth: 47,
      },
      unit: {
        fill: "#fff",
        size: 12,
        opacity: 0.5,
      },
      label: {
        fill: "#fff",
        size: 14,
      },
    },
  },
};
