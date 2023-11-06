import { enums } from "../enums";
const units = ['rem', '%', 'px']

export default [
    { name: 'appShellLayout', group: 'AppShell', type: { name: 'enum', enums: enums.appShellLayouts }, displayName: 'Layout', default: 'default' },
    { name: 'appShellPadding', group: 'AppShell', type: { name: 'enum', enums: enums.sizes }, displayName: 'Padding', default: 'md' },
    { name: 'appShellCustomPadding', group: 'AppShell', type: { name: 'number', units, defaultUnit: 'rem' }, displayName: 'Custom padding' },
    { name: 'hiddenAppShell', group: 'AppShell', type: 'boolean', displayName: 'Hidden', default: false },
    // Navbar    
    { name: 'navbarWithBorder', group: 'Style', type: 'boolean', displayName: 'With border', default: true },
    { name: 'navbarWidth', group: 'Dimensions', type: 'array', displayName: 'Width (resp)', isObject: true, required: true },
    { name: 'navbarRespHide', group: 'Layout', type: 'boolean', displayName: 'Responsive hide', default: false },
    { name: 'navbarHiddenBreakpoint', group: 'Layout', type: { name: 'enum', enums: enums.sizes }, displayName: 'Hidden breakpoint', default: 'md', dependsOn: [{ name: 'navbarRespHide', value: true }] },
    { name: 'navbarOffsetBreakpoint', group: 'Layout', type: { name: 'enum', enums: enums.sizes }, displayName: 'Offset breakpoint', default: 'md', dependsOn: [{ name: 'navbarRespHide', value: true }] },
    // Header
    { name: 'headerWithBorder', group: 'Style', type: 'boolean', displayName: 'With border', default: true },
    { name: 'headerHeight', group: 'Dimensions', type: 'array', displayName: 'Height (resp)', isObject: true, required: true },
    { name: 'burgerSize', group: 'Dimensions', type: { name: 'enum', enums: enums.sizes }, displayName: 'Burger size', default: 'sm' },
    // Aside    
    { name: 'asideWithBorder', group: 'Style', type: 'boolean', displayName: 'With border', default: true },
    { name: 'asideWidth', group: 'Dimensions', type: 'array', displayName: 'Width (resp)', isObject: true, required: true },
    { name: 'asideRespHide', group: 'Layout', type: 'boolean', displayName: 'Responsive hide', default: false },
    { name: 'asideHiddenBreakpoint', group: 'Layout', type: { name: 'enum', enums: enums.sizes }, displayName: 'Hidden breakpoint', default: 'md', dependsOn: [{ name: 'asideRespHide', value: true }] },
    { name: 'asideOffsetBreakpoint', group: 'Layout', type: { name: 'enum', enums: enums.sizes }, displayName: 'Offset breakpoint', default: 'md', dependsOn: [{ name: 'asideRespHide', value: true }] },
    // Footer
    { name: 'footerWithBorder', group: 'Style', type: 'boolean', displayName: 'With border', default: true },
    { name: 'footerHeight', group: 'Dimensions', type: 'array', displayName: 'Height (resp)', isObject: true, required: true },
] as const satisfies readonly NodePort[]