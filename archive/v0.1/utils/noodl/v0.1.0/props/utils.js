export const enums = {
    colorSchemes: [{ value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }],
    sizes: [{ value: 'xs', label: 'xs' }, { value: 'sm', label: 'sm' }, { value: 'md', label: 'md' }, { value: 'lg', label: 'lg' }, { value: 'xl', label: 'xl' }],
    fontWeights: [{ value: '600', label: 'Medium' }, { value: '700', label: 'Bold' }],
    colors: [
        { value: 'white', label: 'White' }, { value: 'gray', label: 'Gray' }, { value: 'dark', label: 'Dark' }, { value: 'blue', label: 'Blue' },
        { value: 'red', label: 'Red' }
    ],
    notificationsPositions: [
        { value: 'top-left', label: 'Top left' }, { value: 'top-right', label: 'Top right' }, { value: 'top-center', label: 'Top center' },
        { value: 'bottom-left', label: 'Bottom left' }, { value: 'bottom-right', label: 'Bottom right' }, { value: 'bottom-center', label: 'Bottom center' },
    ],
    loaderVariants: [{ value: 'bars', label: 'Bars' }, { value: 'dots', label: 'Dots' }],
    stackAligns: [
        { value: 'stretch', label: 'Stretch' }, { value: 'center', label: 'Center' }, { value: 'flex-start', label: 'Flex start' },
        { value: 'flex-end', label: 'Flex end' }
    ],
    flexAligns: [{ value: 'center', label: 'Center' }, { value: 'flex-start', label: 'Flex start' }, { value: 'flex-end', label: 'Flex end' }],
    stackJustifies: [
        { value: 'center', label: 'Center' }, { value: 'flex-start', label: 'Flex start' }, { value: 'flex-end', label: 'Flex end' },
        { value: 'space-between', label: 'Space between' }, { value: 'space-around', label: 'Space around' }
    ],
    flexJustifies: [{ value: 'center', label: 'Center' }, { value: 'flex-start', label: 'Flex start' }, { value: 'flex-end', label: 'Flex end' }],
    avatarVariants: [{ value: 'light', label: 'Light' }, { value: 'filled', label: 'Filled' }, { value: 'outline', label: 'Outline' }],
    useDataTypes: [{ value: 'fetch', label: 'Fetch' }, { value: 'get', label: 'Get' }, { value: 'mGet', label: 'mGet' }],
    directions: [{ value: 'row', label: 'Row' }, { value: 'column', label: 'Column' }],
    wraps: [{ value: 'wrap', label: 'Wrap' }, { value: 'nowrap', label: 'Nowrap' }, { value: 'wrap-reverse', label: 'Wrap reverse' }],
    positions: [{ value: 'left', label: 'Left' }, { value: 'center', label: 'Center' }, { value: 'right', label: 'Right' }, { value: 'apart', label: 'Apart' }],
    colorShades: [
        { value: '0', label: '0' }, { value: '1', label: '1' }, { value: '2', label: '2' }, { value: '3', label: '3' }, { value: '4', label: '4' },
        { value: '5', label: '5' }, { value: '6', label: '6' }, { value: '7', label: '7' }, { value: '8', label: '8' }, { value: '9', label: '9' }
    ],
    actionVariants: [
        { value: 'transparent', label: 'Transparent' }, { value: 'subtle', label: 'Subtle' }, { value: 'filled', label: 'Filled' },
        { value: 'light', label: 'Light' }, { value: 'outline', label: 'Outline' }, { value: 'default', label: 'Default' }
    ],
    drawerPositions: [{ value: 'top', label: 'Top' }, { value: 'right', label: 'Right' }, { value: 'left', label: 'Left' }, { value: 'bottom', label: 'Bottom' }],
    selectableTypes: [{ value: 'singleRow', label: 'Single row' }, { value: 'multipleRows', label: 'Multiple rows' }, { value: 'singleCell', label: 'Single cell' }],
    badgeVariants: [{ value: 'light', label: 'Light' }, { value: 'filled', label: 'Filled' }, { value: 'outline', label: 'Outline' }],
    buttonTypes: [{ value: 'submit', label: 'Submit' }],
    qrCodeLevels: [{ value: 'L', label: 'Lowest' }, { value: 'M', label: 'Medium' }, { value: 'Q', label: 'Quality' }, { value: 'H', label: 'Highest' }],
}

export const units = ['rem', '%', 'px']

export const groups = {
    style: 'Style', layout: 'Layout', dimensions: 'Dimensions', font: 'Font', signals: 'Signals', date: 'Date', data: 'Data', useData: 'UseData', params: 'Params',
    general: 'General', auth: "Auth", params: 'Params', form: 'Form', navigation: 'Navigation',
}