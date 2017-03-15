const { join } = require('path');
const createHandler = require('./lib/handler');

function requiredParam(param, errorMessage) {
  if (!param) {
    throw new Error(`electron-protocol-serve: ${errorMessage}`);
  }
}

/**
 * Registers a file protocol with a single endpoint which handles
 * the proper discovery of local files inside of Electron
 * without modifiying the Ember app.
 *
 * @param  {String} options.cwd                the path to the dist folder of your Ember app
 * @param  {Object} options.app                electron.app
 * @param  {Object} options.protocol           electron.protocol
 * @param  {String} options.name               name of your protocol, defaults to `serve`
 * @param  {String} options.endpoint           endpoint of your protocol, defaults to `dist`
 * @param  {String} options.indexPath          defaults to 'index.html' in cwd
 *
 * @return {String}                            name of your protocol
 */
module.exports = function protocolServe({
  cwd = undefined,
  app,
  protocol,
  name = 'serve',
  endpoint = 'dist',
  indexPath = undefined,
}) {
  requiredParam(cwd, 'cwd must be specified, should be a valid path');
  requiredParam(protocol, 'protocol must be specified, should be electron.protocol');
  requiredParam(app, 'app must be specified, should be electron.app');

  indexPath = indexPath || join(cwd, 'index.html');

  app.on('ready', () => {
    const options = { cwd, name, endpoint, indexPath };
    protocol.registerFileProtocol(name, createHandler(options), error => {
      if (error) {
        console.error('Failed to register protocol');
      }
    });
  });

  return name;
};
