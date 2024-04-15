const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: {
    main: './src/client/js/main.js',
    videoPlayer: './src/client/js/videoPlayer.js',
  },
  mode: 'development',
  watch: true,
  output: {
    filename: 'js/[name].js',
    path: path.resolve(__dirname, 'assets'),
    clean: true,
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/style.css',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['@babel/preset-env', { targets: 'defaults' }]],
          },
        },
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          MiniCssExtractPlugin.loader,
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader',
        ],
      },
    ],
  },
};
