const theme = {
  light: {
    background: "#F0F3FA",
    subLine: {
      stroke: "rgb(0, 161, 255)",
      strokeWidth: 1,
      name: "guid-line",
      dash: [4, 6],
    },
    scale: {
      background: "#fff",
      thickness: 20,
      lineFill: "#000",
      fontColor: "#354052",
      fontOpacity: 0.5,
    },
    rect: {
      fill: "#D8D8D8",
      stroke: "#979797",
      strokeWidth: 1,
      draggable: true,
      strokeScaleEnabled: false,
    },
    selection: {
      fill: "transparent",
      stroke: "black",
    },
    thingTitle: {
      val: {
        fill: "#354052",
        size: 14,
      },
    },
    showVal: {
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
    background: "#08163B",
    subLine: {
      stroke: "rgb(0, 161, 255)",
      strokeWidth: 1,
      name: "guid-line",
      dash: [4, 6],
    },
    scale: {
      background: "#fff",
      thickness: 20,
      lineFill: "#000",
      fontColor: "#354052",
      fontOpacity: 0.5,
    },
    rect: {
      fill: "#2A6BDB",
      stroke: "#979797",
      strokeWidth: 1,
      draggable: true,
      strokeScaleEnabled: false,
    },
    selection: {
      fill: "transparent",
      stroke: "#fff",
    },
    thingTitle: {
      val: {
        fill: "#9CA9C7",
        size: 14,
      },
    },
    showVal: {
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
export type Theme = keyof typeof theme;
export const defaultTheme: Theme = "dark";
export default theme;
