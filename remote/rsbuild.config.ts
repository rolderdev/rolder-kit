import { defineConfig } from '@rsbuild/core';
import { rspack } from '@rspack/core';

//==========================================
import v100Beta12 from './mfes/v1.0.0-beta12';
//==========================================

export default defineConfig({
  html: {
    template: './src/index.html',
  },
  performance: {
    chunkSplit: {
      strategy: 'split-by-experience',
      override: {
        chunks: 'async',
        minSize: 30000,
      },
    },
  },
  output: {
    sourceMap: {
      js: 'source-map',
    },
  },
  tools: {
    rspack: {
      output: {
        publicPath: 'auto'
      },
      externals: {
        react: 'React',
        'react-dom': 'ReactDOM'
      },
      plugins: [new rspack.container.ModuleFederationPlugin(v100Beta12)],
    },
  },
});
