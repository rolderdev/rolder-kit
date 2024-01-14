import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { rspack } from '@rspack/core';
import mfConfig from './mfConfig';

export default defineConfig({
  html: {
    template: './src/index.html',
  },
  plugins: [pluginReact({ swcReactOptions: { runtime: 'classic' } })],
  performance: {
    chunkSplit: {
      strategy: 'split-by-experience',
      override: {
        chunks: 'async',
        minSize: 30000,
      },
    },
  },
  tools: {
    rspack: {
      externals: {
        react: 'React',
        'react-dom': 'ReactDOM'
      },
      output: {
        publicPath: 'auto',
      },
      plugins: [new rspack.container.ModuleFederationPlugin(mfConfig)],
    },
  },
});
