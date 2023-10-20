import { enums } from "../enums";

const layout = [
    { name: 'groupPosition', group: 'Layout', type: { name: 'enum', enums: enums.groupPositions }, displayName: 'Position', default: 'left' },
    { name: 'groupSpacing', group: 'Layout', type: { name: 'enum', enums: enums.sizes }, displayName: 'Spacing', default: 'md' },
    { name: 'stackAlign', group: 'Layout', type: { name: 'enum', enums: enums.stackAligns }, displayName: 'Align', default: 'stretch' },
    { name: 'stackJustify', group: 'Layout', type: { name: 'enum', enums: enums.stackJustifies }, displayName: 'Justify', default: 'center' },
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
    { name: 'inline', group: 'Layout', type: 'boolean', displayName: 'Inline', default: false },
    { name: 'gap', group: 'Layout', type: { name: 'enum', enums: enums.sizes }, displayName: 'Gap', default: 'md' },
    { name: 'rowGap', group: 'Layout', type: { name: 'enum', enums: enums.sizes }, displayName: 'Row gap', default: 'md' },
    { name: 'columnGap', group: 'Layout', type: { name: 'enum', enums: enums.sizes }, displayName: 'Column gap', default: 'md' },
    { name: 'flexJustify', group: 'Layout', type: { name: 'enum', enums: enums.flexJustifies }, displayName: 'Justify', default: 'flex-start' },
    { name: 'flexAlign', group: 'Layout', type: { name: 'enum', enums: enums.flexAligns }, displayName: 'Align', default: 'flex-start' },
    { name: 'flexDirection', group: 'Layout', type: { name: 'enum', enums: enums.flexDirections }, displayName: 'Direction', default: 'row' },
    { name: 'flexWrap', group: 'Layout', type: { name: 'enum', enums: enums.wraps }, displayName: 'Wrap', default: 'wrap' },
    { name: 'dividerOrientation', group: 'Layout', type: { name: 'enum', enums: enums.dividerOrientations }, displayName: 'Orientation', default: 'horizontal' },
    { name: 'dividerLabelPosition', group: 'Layout', type: { name: 'enum', enums: enums.dividerLabelPositions }, displayName: 'Label position', default: 'left' },
    { name: 'dropdownType', group: 'Layout', type: { name: 'enum', enums: enums.dropdownTypes }, displayName: 'Dropdown type', default: 'popover' },
] as const satisfies readonly NodePort[];

export default layout