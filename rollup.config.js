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
export default rollupConfig;
