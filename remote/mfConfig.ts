export default {
  name: 'remote',
  exposes: {
    // ui =================================================
    // MantineOld    
    './ui/mantine/image-v0.3.0': '../nodes/ui/mantineOld/src/nodes/elements/dataDisplay/image/fabricVersions/v0.1.0/v0.3.0/Image',
    // Mantine    
    './ui/mantine/mantine-v0.3.0': '../shared/ui/mantine/v0.3.0/mantine.tsx',
    //// elements
    ////// dataDisplay
    './ui/mantine/elements/dataDisplay/image-v0.4.0': '../shared/ui/mantine/elements/dataDisplay/image/v0.4.0/image.tsx',
    ////// inputs
    './ui/mantine/elements/inputs/password-input-v0.1.0': '../shared/ui/mantine/elements/inputs/passwordInput/v0.1.0/passwordInput.tsx',
    //// molecules
    ////// form
    './ui/mantine/molecules/form-v0.5.0': '../shared/ui/mantine/molecules/form/v0.5.0/form.tsx',
    // WebCamers
    './ui/web-camera-v0.3.0': '../shared/ui/webCamera/v0.3.0/webCamera.tsx',
    // pdf
    './ui/pdf/pdf-viewer-v0.1.0': '../shared/ui/pdf/pdfViewer/v0.1.0/pdfViewer.tsx',
    // data ===============================================
    './data/data-v0.2.0': '../shared/data/data/v0.2.0/data.tsx',
    './data/auth-v0.1.0': '../shared/data/auth/v0.1.0/auth.tsx',
    './data/data-context-v0.1.0': '../shared/data/dataContext/v0.1.0/dataContext.tsx',
    './data/data-context-v0.1.1': '../shared/data/dataContext/v0.1.1/dataContext.tsx',
    './data/use-data-v0.11.0': '../shared/data/useData/v0.11.0/useData.tsx',
    './data/use-data-v0.12.3': '../shared/data/useData/v0.12.3/useData.tsx',
    './data/use-data-v0.12.4': '../shared/data/useData/v0.12.4/useData.tsx',
    './data/use-data-v0.13.0': '../shared/data/useData/v0.13.0/useData.tsx',
    './data/get-data-v0.3.0': '../shared/data/getData/v0.3.0/getData.ts',
  },
  filename: 'remoteEntry.js',
}
