import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
const rollupConfig = [];

rollupConfig.push({
  input: "src/index.ts",
  output: {
    file: `dist/index.js`,
    format: "es",
  },
  plugins: [typescript()],
});
rollupConfig.push({
  input: "src/element/index.ts",
  output: {
    file: `dist/element/index.js`,
    format: "es",
  },
  plugins: [typescript()],
});

rollupConfig.push({
  input: "src/element/index.ts",
  output: {
    file: `dist/element/index.d.ts`,
    format: "es",
  },
  plugins: [dts()],
});

rollupConfig.push({
  input: "src/index.ts",
  output: {
    file: `dist/index.d.ts`,
    format: "es",
  },
  plugins: [dts()],
});
export default rollupConfig;
