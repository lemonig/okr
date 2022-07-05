const {
  when,
  whenDev,
  whenProd,
  whenTest,
  ESLINT_MODES,
  POSTCSS_MODES,
} = require("@craco/craco");
const webpack = require("webpack");
const CracoLessPlugin = require("craco-less");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const webpackBundleAnalyzer =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const compressionWebpackPlugin = require("compression-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const isPro = (dev) => dev === "production";

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            // 主题色配置
            //https://github.com/ant-design/ant-design/blob/master/components/style/themes/default.less
            modifyVars: {
              "@primary-color": "#3370ff", // 全局主色
              "@link-color": "#1890ff", // 链接色
              "@font-size-base": " 12px", // 主字号
              "@modal-color": "rgba(23, 43, 77, 0.06)", //模态框head foot背景色
              "@module-hover": " rgba(0, 0, 0, 1)",
              //表
              "@comment-bg": "#f5f6f7", //评论背景
              "@layout-footer-background": "#f5f6f7", //footer
              "@layout-body-background": "#f0f2f5",
              "@body-background": "#fff",
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
  webpack: {
    plugins: [
      new UglifyJsPlugin({
        uglifyOptions: {
          compress: {},
        },
      }),
    ],
  },
};
