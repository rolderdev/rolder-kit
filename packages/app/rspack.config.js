/**
 * @type {import('@rspack/cli').Configuration}
 */
var path = require('path');
const pJson = require('./package.json');
const rspackBaseConfig = require('@shared/rspack-config-v0.1.0');

const nodeName = pJson.name;
var outputBuildPath = path.resolve(__dirname, `../../build/${nodeName}`);

module.exports = function (env) {
	const config = rspackBaseConfig(nodeName, __dirname, outputBuildPath, env.developer, env.project);

	// css
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
