import { enums } from "../enums";

const style = [
    { name: 'radius', group: 'Style', type: { name: 'enum', enums: enums.sizes }, displayName: 'Radius', default: 'md' },
    { name: 'buttonVariant', group: 'Style', type: { name: 'enum', enums: enums.buttonVariants }, displayName: 'Variant', default: 'filled' },
    { name: 'color', group: 'Style', type: 'string', displayName: 'Color', tooltip: 'red, red.5' },
    { name: 'detectColorScheme', group: 'Style', type: 'boolean', displayName: 'Autodetect color scheme', default: false },
    { name: 'colorScheme', group: 'Style', type: { name: 'enum', enums: enums.colorSchemes }, displayName: 'Default color scheme' },
    { name: 'shadow', group: 'Style', type: { name: 'enum', enums: enums.sizes }, displayName: 'Shadow', default: 'sm' },
    { name: 'buttonColor', group: 'Style', type: 'string', displayName: 'Button color' },
    { name: 'modalOpacity', group: 'Style', type: 'number', displayName: 'Opacity', default: 0.6 },
    { name: 'modalBlur', group: 'Style', type: 'number', displayName: 'Blur', default: 2 },
    { name: 'drawerOpacity', group: 'Style', type: 'number', displayName: 'Opacity', default: 0.6 },
    { name: 'drawerBlur', group: 'Style', type: 'number', displayName: 'Blur', default: 2 },
    { name: 'withAsterisk', group: 'Style', type: 'boolean', displayName: 'With asterisk', default: false },
    { name: 'loaderVariant', group: 'Loader', type: { name: 'enum', enums: enums.loaderVariants }, default: 'oval', displayName: 'Variant' },
    { name: 'loaderColor', group: 'Loader', type: 'string', displayName: 'Color', tooltip: 'red, red.5' },
    { name: 'overlayBlur', group: 'Overlay', type: 'number', displayName: 'Blur', default: 2 },
    { name: 'overlayOpacity', group: 'Overlay', type: 'number', displayName: 'Opacity', default: 0.6 },
    { name: 'overlayColor', group: 'Overlay', type: 'string', displayName: 'Color', tooltip: 'red, red.5' },
    { name: 'withBorder', group: 'Style', type: 'boolean', displayName: 'With border', default: false },
    { name: 'backgroundColor', group: 'Style', type: 'string', displayName: 'Background color', tooltip: 'red, red.5' },
    { name: 'opacity', group: 'Style', type: 'number', displayName: 'Opacity', default: 1 },
    { name: 'avatarVariant', group: 'Loader', type: { name: 'enum', enums: enums.avatarVariants }, default: 'light', displayName: 'Variant' },
    { name: 'navLinkVariant', group: 'Loader', type: { name: 'enum', enums: enums.navLinkVariants }, default: 'light', displayName: 'Variant' },
    { name: 'tabsVariant', group: 'Loader', type: { name: 'enum', enums: enums.tabsVariants }, default: 'default', displayName: 'Variant' },
    { name: 'unstyled', group: 'Style', type: 'boolean', displayName: 'Unstyled', default: false },
    { name: 'withArrow', group: 'Style', type: 'boolean', displayName: 'With arrow', default: true },
    { name: 'checkboxColor', group: 'Checkbox', type: 'string', displayName: 'Color', tooltip: 'red, red.5' },
    { name: 'dividerVariant', group: 'Style', type: { name: 'enum', enums: enums.dividerVariants }, displayName: 'Variant', default: 'solid' },
] as const satisfies readonly NodePort[];

export default style