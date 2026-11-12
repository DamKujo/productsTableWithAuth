import type { StorybookConfig } from '@storybook/react-webpack5';
import path from "node:path";

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  "addons": [
    "@storybook/addon-webpack5-compiler-swc",
  "@storybook/addon-a11y",
  "@storybook/addon-docs",
  "@storybook/addon-onboarding",
  "msw-storybook-addon",
  ],
  "staticDirs": ["../public"],
  "framework": {name: "@storybook/react-webpack5", options: {}
},
webpackFinal: async(config) => {
  // same aliases as webpack.config.js
    config.resolve ??= {};
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(import.meta.dirname, "../src"),
      "@assets": path.resolve(import.meta.dirname, "../src/app/assets"),
      "@shared": path.resolve(import.meta.dirname, "../src/shared"),
  };
  const cssRule = config.module?.rules?.find(
    (rule) => rule && typeof rule === "object" && rule.test?.toString().includes("css"),
  );
  if(cssRule && typeof cssRule === "object" && Array.isArray(cssRule.use)){
    cssRule.use.push("postcss-loader");
  }
  return config;
},
};
export default config;