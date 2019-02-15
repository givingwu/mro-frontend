const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const PreloadPlugin = require('@vue/preload-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');


const baseConfig = require('./webpack.base.conf');
const { paths, devServer } = require('../userConfig');
const { entries, configurations } = require('./utils/multiplePages');
const {
  DefinePlugin,
  HotModuleReplacementPlugin,
  NoEmitOnErrorsPlugin,
  ProgressPlugin
} = webpack;

const DEFAULT_SERVER_CONFIG = {
  host: '0.0.0.0',
  port: 8080,
  https: false
}


module.exports = merge(baseConfig, {
  entry: entries,
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    ...DEFAULT_SERVER_CONFIG,
    contentBase: paths.dist,
    headers: {
      'X-Power-By': 'Webpack-Dev-Server',
    },
    open: true,
    ...devServer,
  },
  plugins: [
    /* config.plugin('define') */
    new DefinePlugin(
      {
        'process.env': {
          NODE_ENV: '"development"',
          BASE_URL: '"/"'
        }
      }
    ),
    /* config.plugin('hmr') */
    new HotModuleReplacementPlugin(),
    /* config.plugin('no-emit-on-errors') */
    new NoEmitOnErrorsPlugin(),
    /* config.plugin('progress') */
    new ProgressPlugin(),
    /* config.plugin('html') */
    ...configurations.map(config => new HtmlWebpackPlugin(config)),
    /* config.plugin('preload') */
    new PreloadPlugin(
      {
        rel: 'preload',
        include: 'initial',
        fileBlacklist: [
          /\.map$/,
          /hot-update\.js$/
        ]
      }
    ),
    /* config.plugin('prefetch') */
    new PreloadPlugin(
      {
        rel: 'prefetch',
        include: 'asyncChunks'
      }
    ),
    /* config.plugin('copy') */
    new CopyWebpackPlugin(
      [
        {
          from: paths.public,
          to: paths.dist,
          toType: 'dir',
          ignore: [
            'index.html',
            '.DS_Store'
          ]
        }
      ]
    )
  ],
})
