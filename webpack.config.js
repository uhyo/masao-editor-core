'use strict';
const path = require('path');
const webpack = require('webpack');

const plugins =
  process.env.NODE_ENV === 'production'
    ? [
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify('production'),
        }),
      ]
    : [];

module.exports = {
  devtool: 'source-map',
  entry: {
    js: './dist-es6/jsx/index.js',
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    library: 'MasaoEditorCore',
    libraryTarget: 'umd',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'source-map-loader',
        enforce: 'pre',
      },
      {
        test: /\.css$/,
        loaders: [
          'style-loader',
          'css-loader?modules&camelCase',
          'postcss-loader',
        ],
      },
      {
        test: /\.json$/,
        loaders: ['json-loader'],
      },
      {
        test: /\.(?:png|gif)$/,
        loaders: [
          'url-loader',
          {
            loader: 'img-loader',
            options: {
              plugins: [
                require('imagemin-gifsicle')({}),
                require('imagemin-pngquant')({}),
              ],
            },
          },
        ],
      },
    ],
  },
  plugins,
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    modules: ['node_modules'],
  },
  externals: {
    react: {
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'react',
      root: 'React',
    },
    tslib: {
      commonjs: 'tslib',
      commonjs2: 'tslib',
    },
    masao: {
      commonjs: 'masao',
      commonjs2: 'masao',
    },
    reflux: {
      commonjs: 'reflux',
      commonjs2: 'reflux',
    },
    mobx: {
      commonjs: 'reflux',
      commonjs2: 'reflux',
    },
  },

  performance: {
    //bye bye, FIXME...
    hints: false,
  },

  devServer: {
    contentBase: './dist',
    port: 8080,
  },
};
