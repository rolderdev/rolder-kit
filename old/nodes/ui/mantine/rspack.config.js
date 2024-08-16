/**
 * @type {import('@rspack/cli').Configuration}
 */
var path = require('path');
const pJson = require('./package.json');
const rspackBaseConfig = require('../../rspackBase.config');

const nodeName = pJson.name;
var outputBuildPath = path.resolve(__dirname, `../../../build/${nodeName}`);

module.exports = function (env) {
	const config = rspackBaseConfig(nodeName, __dirname, outputBuildPath, env.developer, env.project);

	// postcss
	config.module.rules.push({
		test: /\.css$/,
		use: [
			{
				loader: 'postcss-loader',
				/** @type {import('@rspack/core').SwcLoaderOptions} */
			},
		],
		type: 'css/auto',
	});

	return config;
};
