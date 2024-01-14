export default {
  name: 'remote',
  exposes: {
    './port-v0.6.0': '../shared/port/v0.6.0/port.ts',
    './app-v1.4.0': '../shared/app/v1.4.0/app.tsx',
    // ==== ui ====
    // MantineOld    
    './mantine/image-v0.3.0': '../nodes/ui/mantineOld/src/nodes/elements/dataDisplay/image/fabricVersions/v0.1.0/v0.3.0/Image',
    // Mantine
    './mantine/mantine-v0.2.0': '../shared/ui/mantine/v0.2.0/mantine.tsx',
    './mantine/mantine-v0.3.0': '../shared/ui/mantine/v0.3.0/mantine.tsx',
    './mantine/image-v0.4.0': '../shared/ui/mantine/elements/dataDisplay/image/v0.4.0/image.tsx',
    // ==== data ====
    './data/fetch-v0.1.0': '../shared/data/fetch/v0.1.0/fetch.ts',
  },
  filename: 'remoteEntry.js',
};
