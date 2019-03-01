const fs = require('fs')
const path = require('path')
const { exec } = require('child_process')
const { paths } = require('./userConfig')
const { dist } = paths
const javaProjectResourcePath = path.resolve(process.env.HOME, 'Development/WorkSpace/ecommerce/ui/src/main/resources/static')

const files = fs.readdirSync(dist)
const folders = files.filter(file => !path.extname(file))

folders.forEach(folder => {
  const absoluteCurPath = path.resolve(dist, folder);
  const absoluteDistPath = path.resolve(javaProjectResourcePath, folder, './frontend');
  const command = ['cp -rf', absoluteCurPath + '/*', absoluteDistPath].join(' ');

  exec(command, (error) => {
    if (error) {
      console.error(`执行出错: ${error}`);
      return;
    }

    console.log(`copy file ${absoluteCurPath} to ${absoluteDistPath} success!`);
  })
})

