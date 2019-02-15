const path = require('path');
const cwd = process.cwd();
const pagesPath = path.resolve(cwd, './src/pages');
const publicPath = path.resolve(cwd, './public');
const distPath = path.resolve(cwd, './dist');
const themePath = path.resolve(cwd, './src/theme.scss');


module.exports = {
  paths: {
    pages: pagesPath,
    public: publicPath,
    dist: distPath,
    theme: themePath,
    cwd,
  },
  /* https://webpack.js.org/configuration/dev-server/#devserver */
  devServer: {
    proxy: {},
  },
}
