import { defineConfig } from '@rsbuild/core';
import { rspack } from '@rspack/core';
import mfConfig from './mfConfig';

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
  dev: {    
    client: {      
      host: '192.168.122.1',         
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
        publicPath: 'auto',
      },
      externals: {
        react: 'React',
        'react-dom': 'ReactDOM'
      },
      plugins: [new rspack.container.ModuleFederationPlugin(mfConfig)],
    },
  },
});
