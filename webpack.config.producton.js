const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const TerserPlugin = require("terser-webpack-plugin");

module.exports = (env) => {
  return {
    mode: 'production',
    optimization: {
      minimize: true,
      minimizer: [new TerserPlugin({
        terserOptions: {
          mangle: true,
          compress: {
            drop_console: true,
          },
        },
        extractComments:true,
      })],
    },
    entry: {
      main: path.resolve('src/main.ts'),
      game: path.resolve('src/game.ts'),
    },
    output: {
      path: path.resolve(__dirname, './dist'),
      filename: '[name].js',
      library: '[name]',
      libraryTarget: 'umd'
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader',
        },
        {
          test: /\.ts$/,
          loader: 'ts-loader',
          options: {
            appendTsSuffixTo: [/\.vue$/],
          },
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: [
            "style-loader",
            "css-loader"
          ]
        },
      ],
    },
    resolve: {
      extensions: [
        '.ts', '.js', '.vue'
      ],
      modules: ["./node_modules"],
      alias: {
        'vue$': 'vue/dist/vue.esm-bundler.js',
      },
    },
    plugins: [
      new VueLoaderPlugin(),
      new BundleAnalyzerPlugin()
    ],
    devServer: {
      static: {
        directory: path.resolve(__dirname, "./dist"),
      },
    },
  };
};