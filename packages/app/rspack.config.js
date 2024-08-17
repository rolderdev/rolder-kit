/**
 * @type {import('@rspack/cli').Configuration}
 */
const rspack = require('@rspack/core');
var path = require('path');
const pJson = require('./package.json');
const rspackBaseConfig = require('@shared/rspack-config-v0.1.0');

const nodeName = pJson.name;
var outputBuildPath = path.resolve(__dirname, `../../build/${nodeName}`);

module.exports = function (env) {
	const config = rspackBaseConfig(nodeName, __dirname, outputBuildPath, env.developer, env.project);

	// css
	config.plugins.push(new rspack.CssExtractRspackPlugin({}));
	config.module.rules.push({
		rules: [
			{
				test: /\.css$/i,
				use: ['style-loader', 'css-loader'],
				type: 'javascript/auto',
			},
		],
	});

	return config;
};
