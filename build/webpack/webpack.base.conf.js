const path = require('path');
const { paths } = require('../userConfig');
const { transformer, formatter } = require('./utils/resolveLoaderError');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const resolvePath = p => path.resolve(paths.cwd, p);

module.exports = {
  context: paths.cwd,
  output: {
    path: paths.dist,
    filename: '[name].js',
    publicPath: '/',
    globalObject: 'this'
  },
  resolve: {
    alias: {
      '@': resolvePath('./src'),
      components: resolvePath('./src/components'),
      assets: resolvePath('./src/assets'),
      includes: resolvePath('./src/includes'),
      lib: resolvePath('./src/lib'),
      pages: resolvePath('./src/pages'),
      utils: resolvePath('./src/utils'),
    },
    extensions: [
      '.wasm',
      '.mjs',
      '.js',
      '.json'
    ],
    modules: [
      'node_modules',
      './node_modules'
    ],
  },
  module: {
    rules: [
      /* config.module.rule('images') */
      {
        test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 4096,
              fallback: {
                loader: 'file-loader',
                options: {
                  name: 'img/[name].[hash:8].[ext]'
                }
              }
            }
          }
        ]
      },
      /* config.module.rule('svg') */
      {
        test: /\.(svg)(\?.*)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'img/[name].[hash:8].[ext]'
            }
          }
        ]
      },
      /* config.module.rule('media') */
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        use: [
          /* config.module.rule('media').use('url-loader') */
          {
            loader: 'url-loader',
            options: {
              limit: 4096,
              fallback: {
                loader: 'file-loader',
                options: {
                  name: 'media/[name].[hash:8].[ext]'
                }
              }
            }
          }
        ]
      },
      /* config.module.rule('fonts') */
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
        use: [
          /* config.module.rule('fonts').use('url-loader') */
          {
            loader: 'url-loader',
            options: {
              limit: 4096,
              fallback: {
                loader: 'file-loader',
                options: {
                  name: 'fonts/[name].[hash:8].[ext]'
                }
              }
            }
          }
        ]
      },
      /* config.module.rule('vue') */
      {
        test: /\.vue$/,
        use: [
          { loader: 'vue-loader' }
        ],
      },
      /* config.module.rule('pug') */
      {
        test: /\.pug$/,
        use: [
          /* config.module.rule('pug').use('pug-plain-loader') */
          { loader: 'pug-loader' }
        ]
      },
      /* config.module.rule('css') */
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
            options: {
              insertAt: 'top', //Insert style tag at top of <head>
              singleton: true, //this is for wrap all your style in just one style tag
            }
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: false,
              importLoaders: 2
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: false
            }
          }
        ]
      },
      /* config.module.rule('postcss') */
      {
        test: /\.p(ost)?css$/,
        use: [
          {
            loader: 'css-loader',
            options: {
              sourceMap: false,
              importLoaders: 2
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: false
            }
          }
        ]
      },
      {
        test: /\.s(c|a)ss$/,
        use: [
          {
            loader: 'style-loader',
            options: {
              insertAt: 'top', //Insert style tag at top of <head>
              singleton: true, //this is for wrap all your style in just one style tag
            }
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'postcss-loader',
          },
          {
            loader: 'sass-loader',
          },
          {
            loader: 'sass-resources-loader',
            options: {
              resources: paths.theme,
            }
          }
        ]
      },
      /* config.module.rule('less') */
      {
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: false,
              importLoaders: 2
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: false
            }
          },
          {
            loader: 'less-loader',
            options: {
              sourceMap: false
            }
          }
        ]
      },
      /* config.module.rule('js') */
      {
        test: /\.js$/,
        exclude: [
          /node_modules/,
          /\/src\/lib/
        ],
        use: [
          /* config.module.rule('js').use('cache-loader') */
          {
            loader: 'cache-loader',
            options: {
              cacheDirectory: '../node_modules/.cache/babel-loader',
            }
          },
          /* config.module.rule('js').use('thread-loader') */
          {
            loader: 'thread-loader'
          },
          /* config.module.rule('js').use('babel-loader') */
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
            }
          }
        ]
      },
      /* config.module.rule('eslint') */
      {
        enforce: 'pre',
        test: /\.(j|t)s?$/,
        exclude: [
          /node_modules/,
          /\/src\/lib/
        ],
        use: [
          /* config.module.rule('eslint').use('eslint-loader') */
          {
            loader: 'eslint-loader',
            options: {
              extensions: [
                '.js',
                '.jsx',
              ],
              cache: true,
              emitWarning: true,
              emitError: false,
              configFile: path.resolve(paths.cwd, ".eslintrc.js"),
            }
          }
        ]
      }
    ]
  },
  plugins: [
    // new VueLoaderPlugin(),
    /* config.plugin('case-sensitive-paths') */
    new CaseSensitivePathsPlugin(),
    // friendly error plugin displays very confusing errors when webpack
    // fails to resolve a loader, so we provide custom handlers to improve it
    new FriendlyErrorsWebpackPlugin({
      additionalTransformers: [transformer],
      additionalFormatters: [formatter],
    })
  ],
  node: {
    setImmediate: false,
    process: 'mock',
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  },
}
