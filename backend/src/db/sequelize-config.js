require("ts-node").register({
  compilerOptions: {
    module: "commonjs",
    isolatedModules: false,
  },
});

const configTS = require("./config.ts").default;

module.exports = configTS;
