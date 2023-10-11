import { enums } from "../enums";

const layout = [
    { name: 'stackSpacing', group: 'Layout', type: { name: 'enum', enums: enums.sizes }, displayName: 'Spacing', default: 'md' },
    { name: 'fullScreen', group: 'Layout', type: 'boolean', displayName: 'Fullscreen', default: false },
    { name: 'drawerPosition', group: 'Layout', type: { name: 'enum', enums: enums.drawerPositions }, displayName: 'Position', default: 'right' },
    { name: 'notificationsPosition', group: 'Layout', type: { name: 'enum', enums: enums.notificationsPositions }, displayName: 'Notifications position', default: 'bottom-right' },
    { name: 'grow', group: 'Layout', type: 'boolean', displayName: 'Grow', default: false },
    { name: 'tabsPosition', group: 'Layout', type: { name: 'enum', enums: enums.tabsPositions }, displayName: 'Tabs position', default: 'left' },
    { name: 'tabsOrientation', group: 'Layout', type: { name: 'enum', enums: enums.tabsOrientations }, displayName: 'Tabs orientation', default: 'horizontal' },
    { name: 'popoverPosition', group: 'Layout', type: { name: 'enum', enums: enums.popoverPositions }, displayName: 'Position', },
    { name: 'dropdownPosition', group: 'Layout', type: { name: 'enum', enums: enums.dropdownPositions }, displayName: 'Position', default: 'flip' },
    { name: 'segmentedControlOrientation', group: 'Layout', type: { name: 'enum', enums: enums.segmentedControlOrientations }, displayName: 'Orientation', default: 'horizontal' },
    { name: 'checkboxGroupOrientation', group: 'Layout', type: { name: 'enum', enums: enums.checkboxGroupOrientations }, displayName: 'Orientation', default: 'horizontal' },
] as const satisfies readonly NodePort[];

export default layout