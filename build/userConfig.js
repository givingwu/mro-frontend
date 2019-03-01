const path = require('path');
const cwd = process.cwd();
const srcPath = path.resolve(cwd, './src');
const pagesPath = path.resolve(cwd, './src/pages');
const publicPath = path.resolve(cwd, './public');
const mixinsPath = path.resolve(cwd, './src/includes/mixins')
const distPath = path.resolve(cwd, './dist');
const rollupBuiltPath = path.resolve(cwd, './dist1');
const themePath = path.resolve(cwd, './src/theme.scss');


module.exports = {
  paths: {
    src: srcPath,
    pages: pagesPath,
    public: publicPath,
    dist: distPath,
    rollup: rollupBuiltPath,
    theme: themePath,
    mixins: mixinsPath,
    cwd,
  },
  /* https://webpack.js.org/configuration/dev-server/#devserver */
  devServer: {
    /* https://www.npmjs.com/package/http-proxy-middleware */
    proxy: {
      '/api/*': {
        target: 'http://172.16.30.225:8015',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '', // rewrite path
        }
      }
    },
  },
}

