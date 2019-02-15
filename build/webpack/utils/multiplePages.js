const fs = require('fs');
const path = require('path');
const { paths } = require('../../userConfig');
const pagesFolderPath = paths.pages;
const pagesFolders = fs.readdirSync(pagesFolderPath, 'utf8');

module.exports = {
  entries: pagesFolders.reduce((entries, page) => {
    let jsFilePath = path.resolve(pagesFolderPath, page, 'index.js');

    if (!fs.existsSync(jsFilePath)) {
      try {
        fs.writeFileSync(jsFilePath, `console.log("${page}/index.js file was auto generated!")`);
      } catch (e) {
        console.error('Cannot write file ', e);
      }
    }
    if (!fs.existsSync(jsFilePath)) {
      throw new Error(jsFilePath + ' does not exists!');
    }

    return {
      ...entries,
      [page]: jsFilePath,
    };
  }, {}),

  configurations: pagesFolders.map(page => {
    let templatePath = path.resolve(pagesFolderPath, page, 'index.pug');
    let isVueFile = false

    if (!fs.existsSync(templatePath)) {
      templatePath = path.resolve(pagesFolderPath, page, 'index.html');
    }

    if (!fs.existsSync(templatePath)) {
      templatePath = path.resolve(pagesFolderPath, page, 'index.vue');

      if (fs.existsSync(templatePath)) {
        isVueFile = true;
        templatePath = path.resolve(paths.public, 'index.html');
      }
    }

    if (!fs.existsSync(templatePath)) {
      templatePath = path.resolve(pagesFolderPath, page, page + '.pug');
    }

    if (!fs.existsSync(templatePath)) {
      throw new Error(templatePath + ' does not exists!');
    }

    /* https://github.com/jantimon/html-webpack-plugin#options */
    return {
      filename: `${page}.html`,
      template: templatePath,
      chunks: [page],
    };
  }),
};

// console.log(module.exports)
