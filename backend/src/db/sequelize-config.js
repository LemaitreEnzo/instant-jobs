require("ts-node").register({
  compilerOptions: {
    module: "commonjs",
    isolatedModules: false,
  },
});

const configTS = require("./config.ts");

module.exports = configTS.default || configTS;
