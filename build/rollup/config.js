// inspired from https://github.com/vuejs/vue/blob/dev/scripts/config.js
const path = require('path')
const nodeResolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const babel = require('rollup-plugin-babel')
const scss = require('rollup-plugin-scss')
const { paths } = require('../userConfig')
const { entries } = require('../webpack/utils/multiplePages')
const { mixins, cwd, theme, src } = paths

const resolve = (currPath) => path.resolve(cwd, currPath)
const components = [
  // 'SearchTab',
  // 'Cascader',
  'CategoryMenu',
  'CheckBox',
  'InputNumber',
  'OpacityBanner',
  'PreviewSwitcher',
  'SpecSelector',
  'SideBar',
  'Tab'
]

const banner = '/*!\n' +
` * 中建电商` +
` * (c) 2014-${new Date().getFullYear()} www.yzw.cn\n` +
' * All Rights Reserved.\n' +
' */'
const resolveConfig = (entry, name) => {
  return {
    entry,
    dest: resolve(`rollup/${name}-runtime.js`),
    format: 'iife',
    env: 'production',
    moduleName: name,
    banner
  }
}

let builds = {} || Object.keys(entries).reduce((all, key) => {
  const entry = entries[key]
  // const name = [key, '-runtime-prod.js']

  all[key] = resolveConfig(entry, key)

  return all;
}, {})

builds = Object.assign({}, builds, components.reduce((all, component) => {
  const entry = path.resolve(mixins, component, 'index.js')

  all[component] = resolveConfig(entry, component)

  return all;
}, {}))

function genConfig (name) {
  const opts = builds[name]
  const config = {
    input: opts.entry,
    external: ['jquery'], // 告诉 rollup 不要将此 lodash 打包，而作为外部依赖
    output: {
      file: opts.dest,
      format: opts.format,
      banner: opts.banner,
      name: opts.moduleName,
      globals: { jquery: '$' }, // 告诉rollup 全局变量$即是jquery
    },
    plugins: [
      nodeResolve({
        jsnext: true,
        module: true,
        main: true,  // for commonjs modules that have an index.js
        browser: true
      }),
      babel({
        presets: [['env', { modules: false }]],
        runtimeHelpers: true,
        sourceMap: false,
        include: src,
        exclude: 'node_modules/**',
        extensions: ['.js', '.jsx', '.es6', '.es', '.mjs'],
      }),
      commonjs({
        include: 'node_modules/**',
        namedExports: {
         'node_modules/jquery/dist/jquery.min.js': [ 'jquery' ],
        }
      }),
      scss({
        outFile: '[file].bundle.css',
        data: theme,
      })
    ].concat(opts.plugins || []),
    cache: true,
    onwarn: (msg, warn) => {
      if (!/Circular/.test(msg)) {
        warn(msg)
      }

      // Suppress this error message... there are hundreds of them. Angular team says to ignore it.
      // https://github.com/rollup/rollup/wiki/Troubleshooting#this-is-undefined
      if (msg.code === 'THIS_IS_UNDEFINED') return;

      console.error(msg);
    }
  }

  Object.defineProperty(config, '_name', {
    enumerable: false,
    value: name
  })

  return config
}

if (process.env.TARGET) {
  module.exports = genConfig(process.env.TARGET)
} else {
  exports.getBuild = genConfig
  exports.getAllBuilds = () => Object.keys(builds).map(genConfig)
  // console.log('exports.getAllBuilds: ', exports.getAllBuilds);
}
