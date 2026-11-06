import path from "node:path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { ModuleFederationPlugin } from "@module-federation/enhanced/webpack";
import pkg from "./package.json" with { type: "json" };

const root = import.meta.dirname;
const deps = pkg.dependencies;
const headerRemoteUrl =
  process.env.HEADER_REMOTE_URL ?? "http://localhost:3002/remoteEntry.js";

const footerRemoteUrl = process.env.FOOTER_REMOTE_URL ?? "http://localhost:3003/remoteEntry.js";

const productsRemoteUrl =
  process.env.PRODUCTS_REMOTE_URL ?? "http://localhost:3004/remoteEntry.js";

/** @type {(env: unknown, argv: { mode?: string }) => import("webpack").Configuration} */
export default (_env, argv) => {
  const isDev = argv.mode !== "production";

  return {
    mode: isDev ? "development" : "production",
    entry: "./src/app/main.tsx",
    devtool: isDev ? "eval-cheap-module-source-map" : "source-map",
    output: {
      path: path.resolve(root, "dist"),
      // MF's runtime module can't resolve [contenthash], so only lazy chunks get hashed
      filename: "[name].js",
      chunkFilename: isDev ? "[name].js" : "[name].[contenthash].js",
      // absolute so lazy chunks resolve on nested routes like /products
      publicPath: "/",
      clean: true,
    },
    resolve: {
      extensions: [".tsx", ".ts", ".jsx", ".js"],
      alias: {
        "@": path.resolve(root, "src"),
        "@assets": path.resolve(root, "src/app/assets"),
        "@components": path.resolve(root, "src/components"),
        "@features": path.resolve(root, "src/features"),
        "@lib": path.resolve(root, "src/lib"),
        "@services": path.resolve(root, "src/services"),
        "@shared": path.resolve(root, "src/shared"),
        "@types": path.resolve(root, "src/shared/types"),
      },
    },
    module: {
      rules: [
        {
          test: /\.[jt]sx?$/,
          exclude: /node_modules/,
          use: {
            loader: "swc-loader",
            options: {
              jsc: {
                parser: { syntax: "typescript", tsx: true },
                transform: { react: { runtime: "automatic", development: isDev } },
                target: "es2022",
              },
            },
          },
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader", "postcss-loader"],
        },
        {
          test: /\.(svg|png|jpe?g|gif|webp|ico)$/i,
          type: "asset/resource",
        },
      ],
    },
    plugins: [
      new ModuleFederationPlugin({
        name: "host",
        remotes: {
          header: `header@${headerRemoteUrl}`,
          footer: `footer@${footerRemoteUrl}`,
          products: `products@${productsRemoteUrl}`,
        },
        shared: {
          react: { singleton: true, requiredVersion: deps.react },
          "react-dom": { singleton: true, requiredVersion: deps["react-dom"] },
          // a subpath isn't covered by "react-dom"; the products remote renders with it
          "react-dom/client": {
            singleton: true,
            requiredVersion: deps["react-dom"],
          },
          "react-router-dom": {
            singleton: true,
            requiredVersion: deps["react-router-dom"],
          },
          "@tanstack/react-query": {
            singleton: true,
            requiredVersion: deps["@tanstack/react-query"],
          },
          zustand: { singleton: true, requiredVersion: deps.zustand },
        },
        dts: false,
      }),
      new HtmlWebpackPlugin({ template: "./index.html" }),
    ],
    devServer: {
      port: 3001,
      historyApiFallback: true,
      hot: true,
    },
  };
};
