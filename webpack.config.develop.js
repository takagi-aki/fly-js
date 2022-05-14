const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = (env) => {
  return {
    entry: path.resolve('src/main.ts'),
    mode: 'development',
    output: {
      path: path.resolve(__dirname, './dist'),
      filename: 'main.js',
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
    ],
    devServer: {
      static: {
        directory: path.resolve(__dirname, "./dist"),
      },
    },
  };
};