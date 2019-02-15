const url = require('url');
const chalk = require('chalk');
const portfinder = require('portfinder');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('../webpack.dev.conf');
const prepareURLs = require('./prepareURLs');
const { openBrowser } = require('./openBrowser');

module.exports = serve()

async function serve() {
  // although this is primarily a dev server, it is possible that we
  // are running it in a mode with a production env, e.g. in E2E tests.
  const isInContainer = checkInContainer();
  const isProduction = process.env.NODE_ENV === 'production';

  // server configuration
  const { devServer: projectDevServerOptions, output } = webpackConfig;
  const options = { ...webpackConfig }
  const { publicPath } = output;
  const { public: rawPublicUrl, host, https: useHttps } = projectDevServerOptions;

  portfinder.basePort = process.env.PORT || projectDevServerOptions.port;
  const port = await portfinder.getPortPromise();
  const protocol = useHttps ? 'https' : 'http';
  const publicUrl = rawPublicUrl
    ? /^[a-zA-Z]+:\/\//.test(rawPublicUrl)
      ? rawPublicUrl
      : `${protocol}://${rawPublicUrl}`
    : null;
  const urls = prepareURLs(protocol, host, port, '/' || isAbsoluteUrl(publicPath) ? '/' : publicPath);

  // inject dev & hot-reload middleware entries
  if (!isProduction) {
    const sockjsUrl = publicUrl
      ? // explicitly configured via devServer.public
        `?${publicUrl}/sockjs-node`
      : isInContainer
      ? // can't infer public netowrk url if inside a container...
        // use client-side inference (note this would break with non-root baseUrl)
        ``
      : // otherwise infer the url
        `?` +
        url.format({
          protocol,
          port,
          hostname: urls.lanUrlForConfig || 'localhost',
          pathname: '/sockjs-node',
        });
    const devClients = [
      // dev server client
      require.resolve(`webpack-dev-server/client`) + sockjsUrl,
      // hmr client
      require.resolve(
        projectDevServerOptions.hotOnly ? 'webpack/hot/only-dev-server' : 'webpack/hot/dev-server'
      ),
    ];

    // ??
    if (process.env.APPVEYOR) {
      devClients.push(`webpack/hot/poll?500`);
    }

    // inject dev/hot client
    addDevClientToEntry(webpackConfig, devClients);
  }

  // create compiler
  const compiler = webpack(webpackConfig);

  const finalServeConfig = Object.assign(
    {
      clientLogLevel: 'none',
      watchContentBase: !isProduction,
      hot: !isProduction,
      quiet: true,
      compress: isProduction,
      overlay: isProduction // TODO disable this
        ? false
        : { warnings: false, errors: true },
      https: useHttps,
    },
    projectDevServerOptions
  );

  // create server
  const server = new WebpackDevServer(compiler, finalServeConfig);

  ['SIGINT', 'SIGTERM'].forEach(signal => {
    process.on(signal, () => {
      server.close(() => {
        process.exit(0);
      });
    });
  });

  // log instructions & open browser on first compilation complete
  let isFirstCompile = true;
  // compiler.hooks.done.tap('done', stats => {
    // if (stats.hasErrors()) {
    //   return;
    // }

    let copied = '';
    if (isFirstCompile || options.copy) {
      require('clipboardy').write(urls.localUrlForBrowser);
      copied = chalk.dim('(copied to clipboard)');
    }

    const networkUrl = publicUrl ? publicUrl.replace(/([^/])$/, '$1/') : urls.lanUrlForTerminal;

    console.log();
    console.log(`  App running at:`);
    console.log(`  - Local:   ${chalk.cyan(urls.localUrlForTerminal)} ${copied}`);
    if (!isInContainer) {
      console.log(`  - Network: ${chalk.cyan(networkUrl)}`);
    } else {
      console.log();
      console.log(chalk.yellow(`  It seems you are running Vue CLI inside a container.`));
      if (!publicUrl && options.baseUrl && options.baseUrl !== '/') {
        console.log();
        console.log(
          chalk.yellow(`  Since you are using a non-root baseUrl, the hot-reload socket`)
        );
        console.log(
          chalk.yellow(`  will not be able to infer the correct URL to connect. You should`)
        );
        console.log(
          chalk.yellow(`  explicitly specify the URL via ${chalk.blue(`devServer.public`)}.`)
        );
        console.log();
      }
      console.log(
        chalk.yellow(
          `  Access the dev server via ${chalk.cyan(
            `${protocol}://localhost:<your container's external mapped port>${options.baseUrl}`
          )}`
        )
      );
    }
    console.log();

    if (isFirstCompile) {
      isFirstCompile = false;

      if (!isProduction) {
        const buildCommand = /* hasProjectYarn(api.getCwd()) ? `yarn build` :  */`npm run build`;
        console.log(`  Note that the development build is not optimized.`);
        console.log(`  To create a production build, run ${chalk.cyan(buildCommand)}.`);
      } else {
        console.log(`  App is served in production mode.`);
        console.log(`  Note this is for preview or E2E testing only.`);
      }
      console.log();

      if (projectDevServerOptions.open) {
        const pageUri =
          projectDevServerOptions.openPage && typeof projectDevServerOptions.openPage === 'string'
            ? projectDevServerOptions.openPage
            : '';
        openBrowser(urls.localUrlForBrowser + pageUri);
      }

      // resolve returned Promise
      // so other commands can do api.service.run('serve').then(...)
      /* resolve({
        server,
        url: urls.localUrlForBrowser,
      }); */
    } else if (process.env.VUE_CLI_TEST) {
      // signal for test to check HMR
      console.log('App updated');
    }
  // });

  server.listen(port, host, err => {
    if (err) {
      reject(err);
    }
  });
}

function addDevClientToEntry(config, devClient) {
  const { entry } = config;
  if (typeof entry === 'object' && !Array.isArray(entry)) {
    Object.keys(entry).forEach(key => {
      entry[key] = devClient.concat(entry[key]);
    });
  } else if (typeof entry === 'function') {
    config.entry = entry(devClient);
  } else {
    config.entry = devClient.concat(entry);
  }
}

// https://stackoverflow.com/a/20012536
function checkInContainer() {
  const fs = require('fs');
  if (fs.existsSync(`/proc/1/cgroup`)) {
    const content = fs.readFileSync(`/proc/1/cgroup`, 'utf-8');
    return /:\/(lxc|docker|kubepods)\//.test(content);
  }
}

function isAbsoluteUrl(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//"
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
}
