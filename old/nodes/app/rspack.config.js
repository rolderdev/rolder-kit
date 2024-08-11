/**
 * @type {import('@rspack/cli').Configuration}
 */
var rspack = require('@rspack/core');
var path = require('path');
const pJson = require('./package.json');
const rspackBaseConfig = require('../../rspackBase.config');

const nodeName = pJson.name;
var outputBuildPath = path.resolve(__dirname, `../../../build/${nodeName}`);

module.exports = function (env) {
	const config = rspackBaseConfig(nodeName, __dirname, outputBuildPath, env.developer, env.project);
	config.plugins.push(
		new rspack.DefinePlugin({
			DEVMODE: env.devMode ? true : false,
		})
	);

	return config;
};
