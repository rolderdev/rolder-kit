/**
 * @type {import('@rspack/cli').Configuration}
 */
const rspack = require('@rspack/core');
const manifestPlugin = require('rspack-manifest-plugin').WebpackManifestPlugin
//const { GenerateSW } = require("workbox-rspack-plugin");

var path = require('path')
const pJson = require('./package.json')
var outputPath = path.resolve(__dirname, `./dist`)

module.exports = function (env) {
    return {
        context: __dirname,
        stats: { preset: 'errors-only', timings: true },
        entry: { [pJson.name]: `./appNode.ts` },
        resolve: {
            extensions: ['...', '.tsx', '.ts']
        },
        output: {
            path: outputPath,
            filename: '[contenthash].js',
            clean: true,
        },
        externals: {
            react: 'React',
            'react-dom': 'ReactDOM'
        },
        plugins: [
            new manifestPlugin({
                writeToFileEmit: true,
                generate(_, files) {
                    return { main: files[0].path.replace('auto/', '') }
                }
            }),
            new rspack.DefinePlugin({
                DEVMODE: env.noodlDev ? true : false
            }),
            /* new GenerateSW({
                exclude: [/\.(?:png|jpg|jpeg|svg)$/],

                // Define runtime caching rules.
                runtimeCaching: [{
                    // Match any request that ends with .png, .jpg, .jpeg or .svg.
                    urlPattern: /\.(?:js|png|jpg|jpeg|svg)$/,

                    // Apply a cache-first strategy.
                    handler: 'CacheFirst',

                    options: {
                        // Use a custom cache name.
                        cacheName: 'images',

                        // Only cache 10 images.
                        expiration: {
                            maxEntries: 10,
                        }
                    }
                }]
            }), */
        ],
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    exclude: /[\\/]node_modules[\\/]/,
                    loader: 'builtin:swc-loader',
                    options: {
                        jsc: {
                            parser: {
                                syntax: "typescript"
                            }
                        },
                        env: {
                            targets: "Chrome >= 80"
                        }
                    }
                },
                {
                    test: /\.tsx$/,
                    exclude: /[\\/]node_modules[\\/]/,
                    loader: 'builtin:swc-loader',
                    options: {
                        jsc: {
                            parser: {
                                syntax: "typescript",
                                tsx: true
                            }
                        }
                    }
                },
                {
                    test: /\.jsx$/,
                    exclude: /[\\/]node_modules[\\/]/,
                    loader: 'builtin:swc-loader',
                    options: {
                        jsc: {
                            parser: {
                                syntax: "ecmascript",
                                jsx: true
                            },
                        }
                    }
                },
            ]
        }
    }
}
