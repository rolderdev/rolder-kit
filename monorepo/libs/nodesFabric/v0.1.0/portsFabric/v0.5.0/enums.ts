export const enums: { [key: string]: NoodlEnum[] } = {
    colorSchemes: [{ value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }],
    sizes: [
        { value: 'xs', label: 'xs' }, { value: 'sm', label: 'sm' }, { value: 'md', label: 'md' }, { value: 'lg', label: 'lg' },
        { value: 'xl', label: 'xl' },
    ],
    tableDensities: [{ value: 'xs', label: 'xs' }, { value: 'md', label: 'md' }, { value: 'xl', label: 'xl' }],
    fontWeights: [{ value: '400', label: 'Normal' }, { value: '600', label: 'Medium' }, { value: '700', label: 'Bold' }],
    colors: [
        { value: 'gray', label: 'Gray' }, { value: 'dark', label: 'Dark' }, { value: 'blue', label: 'Blue' }, { value: 'red', label: 'Red' }
    ],
    notificationsPositions: [
        { value: 'top-left', label: 'Top left' }, { value: 'top-right', label: 'Top right' }, { value: 'top-center', label: 'Top center' },
        { value: 'bottom-left', label: 'Bottom left' }, { value: 'bottom-right', label: 'Bottom right' },
        { value: 'bottom-center', label: 'Bottom center' },
    ],
    loaderVariants: [{ value: 'oval', label: 'Oval' }, { value: 'bars', label: 'Bars' }, { value: 'dots', label: 'Dots' }],
    stackAligns: [
        { value: 'stretch', label: 'Stretch' }, { value: 'center', label: 'Center' }, { value: 'flex-start', label: 'Flex start' },
        { value: 'flex-end', label: 'Flex end' }
    ],
    stackJustifies: [
        { value: 'center', label: 'Center' }, { value: 'flex-start', label: 'Flex start' }, { value: 'flex-end', label: 'Flex end' },
        { value: 'space-between', label: 'Space between' }, { value: 'space-around', label: 'Space around' }
    ],
    avatarVariants: [{ value: 'light', label: 'Light' }, { value: 'filled', label: 'Filled' }, { value: 'outline', label: 'Outline' },
    { value: 'gradient', label: 'Gradient' }],
    navLinkVariants: [{ value: 'light', label: 'Light' }, { value: 'filled', label: 'Filled' }, { value: 'outline', label: 'Outline' }],
    queryTypes: [
        { value: 'query', label: 'Query' }, //{ value: 'scheme', label: 'Scheme' },
    ],
    directions: [{ value: 'row', label: 'Row' }, { value: 'column', label: 'Column' }],
    wraps: [{ value: 'wrap', label: 'Wrap' }, { value: 'nowrap', label: 'Nowrap' }, { value: 'wrap-reverse', label: 'Wrap reverse' }],
    groupPositions: [
        { value: 'left', label: 'Left' }, { value: 'center', label: 'Center' }, { value: 'right', label: 'Right' },
        { value: 'apart', label: 'Apart' }
    ],
    textAligns: [
        { value: 'left', label: 'Left' }, { value: 'center', label: 'Center' }, { value: 'right', label: 'Right' }
    ],
    popoverPositions: [
        { value: 'bottom', label: 'Bottom' }, { value: 'left', label: 'Left' }, { value: 'right', label: 'Right' },
        { value: 'top', label: 'Top' },
        { value: 'bottom-end', label: 'Bottom end' }, { value: 'bottom-start', label: 'Bottom start' },
        { value: 'left-end', label: 'Left end' }, { value: 'left-start', label: 'Left start' },
        { value: 'right-end', label: 'Right end' }, { value: 'right-start', label: 'Right start' },
        { value: 'top-end', label: 'Top end' }, { value: 'top-start', label: 'Top start' },
    ],
    indicatorPositions: [
        { value: 'bottom-end', label: 'Bottom end' }, { value: 'bottom-start', label: 'Bottom start' }, { value: 'top-end', label: 'Top end' },
        { value: 'top-start', label: 'Top start' }, { value: 'bottom-center', label: 'Bottom center' },
        { value: 'top-center', label: 'Top center' }, { value: 'middle-center', label: 'Middle center' },
        { value: 'middle-end', label: 'Middle end' }, { value: 'middle-center', label: 'Middle center' },
    ],
    colorShades: [
        { value: '0', label: '0' }, { value: '1', label: '1' }, { value: '2', label: '2' }, { value: '3', label: '3' }, { value: '4', label: '4' },
        { value: '5', label: '5' }, { value: '6', label: '6' }, { value: '7', label: '7' }, { value: '8', label: '8' }, { value: '9', label: '9' }
    ],
    buttonVariants: [
        { value: 'default', label: 'Default' }, { value: 'filled', label: 'Filled' }, { value: 'subtle', label: 'Subtle' },
        { value: 'outline', label: 'Outline' }, { value: 'light', label: 'Light' }, { value: 'gradient', label: 'Gradient' },
        { value: 'white', label: 'White' },
    ],
    drawerPositions: [
        { value: 'top', label: 'Top' }, { value: 'right', label: 'Right' }, { value: 'left', label: 'Left' }, { value: 'bottom', label: 'Bottom' }
    ],
    selectableTypes: [
        { value: 'clickOnly', label: 'Click only' }, { value: 'singleRow', label: 'Single row' }, { value: 'multipleRows', label: 'Multiple rows' }
    ],
    badgeVariants: [
        { value: 'light', label: 'Light' }, { value: 'filled', label: 'Filled' }, { value: 'outline', label: 'Outline' },
        { value: 'dot', label: 'Dot' }, { value: 'gradient', label: 'Gradient' }
    ],
    buttonTypes: [{ value: 'submit', label: 'Submit' }],
    qrCodeLevels: [
        { value: 'L', label: 'Lowest' }, { value: 'M', label: 'Medium' }, { value: 'Q', label: 'Quality' }, { value: 'H', label: 'Highest' }
    ],
    datePickerTypes: [{ value: 'default', label: 'Default' }, { value: 'range', label: 'Range' },],
    dropdownTypes: [{ value: 'popover', label: 'Popover' }, { value: 'modal', label: 'Modal' },],
    labelPositions: [{ value: 'right', label: 'Right' }, { value: 'left', label: 'Left' },],
    dividerVariants: [{ value: 'solid', label: 'Solid' }, { value: 'dashed', label: 'Dashed' }, { value: 'dotted', label: 'Dotted' }],
    dividerLabelPositions: [{ value: 'left', label: 'Left' }, { value: 'right', label: 'Right' }, { value: 'center', label: 'Center' },],
    dividerOrientations: [{ value: 'horizontal', label: 'Horizontal' }, { value: 'vertical', label: 'Vertical' },],
    maskTypes: [{ value: 'pattern', label: 'Pattern' }, { value: 'number', label: 'Number' }],
    validationTypes: [
        { value: 'onSubmit', label: 'On submit' }, { value: 'onChange', label: 'On change' }, { value: 'onBlur', label: 'On blur' }
    ],
    appShellLayouts: [{ value: 'default', label: 'Default' }, { value: 'alt', label: 'Alt' }],
    tabsVariants: [{ value: 'default', label: 'Default' }, { value: 'outline', label: 'Outline' }, { value: 'pills', label: 'Pills' }],
    tabsPositions: [
        { value: 'left', label: 'Left' }, { value: 'right', label: 'Right' }, { value: 'center', label: 'Center' },
        { value: 'apart', label: 'Apart' }
    ],
    tabsOrientations: [{ value: 'horizontal', label: 'Horizontal' }, { value: 'vertical', label: 'Vertical' }],
    segmentedControlOrientations: [{ value: 'horizontal', label: 'Horizontal' }, { value: 'vertical', label: 'Vertical' }],
    tableVariants: [{ value: 'basic', label: 'Basic' }, { value: 'grouped', label: 'Grouped' }],
    tableLayouts: [{ value: 'auto', label: 'Auto' }, { value: 'fixed', label: 'Fixed' }],
    expandOnVariants: [{ value: 'row', label: 'Row' }, { value: 'icon', label: 'Icon' }],
    dropdownPositions: [{ value: 'flip', label: 'Flip' }, { value: 'bottom', label: 'Bottom' }, { value: 'top', label: 'Top' }],
    checkboxGroupOrientations: [{ value: 'horizontal', label: 'Horizontal' }, { value: 'vertical', label: 'Vertical' }],
    textFormats: [
        { value: 'none', label: 'None' }, { value: 'number', label: 'Number' }, { value: 'date', label: 'Date' },
        { value: 'mask', label: 'Mask' },
    ],
    dataSources: [{ value: 'item', label: 'Item' }, { value: 'value', label: 'Value' }],
    dataSources2: [{ value: 'item', label: 'Item' }, { value: 'table', label: 'Table' }, { value: 'value', label: 'Value' }],
    flexJustifies: [{ value: 'flex-start', label: 'Flex-start' }, { value: 'center', label: 'Center' },
    { value: 'flex-end', label: 'Flex-end' }],
    flexAligns: [{ value: 'flex-start', label: 'Flex-start' }, { value: 'center', label: 'Center' }, { value: 'flex-end', label: 'Flex-end' }],
    flexDirections: [{ value: 'row', label: 'Row' }, { value: 'column', label: 'Column' },
    { value: 'row-reverse', label: 'Row-reverse' }, { value: 'column-reverse', label: 'Column-reverse' }],
    actionIconVariants: [{ value: 'transparent', label: 'Transparent' }, { value: 'subtle', label: 'Subtle' }, { value: 'light', label: 'Light' },
    { value: 'filled', label: 'Filled' }, { value: 'outline', label: 'Outline' }, { value: 'default', label: 'Default' },],
    textareaVariants: [{ value: 'default', label: 'Default' }, { value: 'filled', label: 'Filled' }, { value: 'unstyled', label: 'Unstyled' }],
    popoverTargets: [{ value: 'actionIcon', label: 'ActionIcon' }, { value: 'button', label: 'Button' }],
    gridJustifies: [
        { value: 'flex-start', label: 'Flex-start' }, { value: 'flex-end', label: 'Flex-end' }, { value: 'center', label: 'Center' },
        { value: 'space-between', label: 'Space between' }, { value: 'space-around', label: 'Space around' }
    ],
    gridAligns: [
        { value: 'stretch', label: 'Stretch' }, { value: 'center', label: 'Center' }, { value: 'flex-start', label: 'Flex start' },
        { value: 'flex-end', label: 'Flex end' }
    ],
    dataFormats: [{ value: 'file', label: 'File' }, { value: 'webcam', label: 'Webcam' },],
    numberInputVariants: [
        { value: 'default', label: 'Default' }, { value: 'filled', label: 'Filled' }, { value: 'unstyled', label: 'Unstyled' }
    ],
    table2VerticalAlignments: [{ value: 'center', label: 'Center' }, { value: 'top', label: 'Top' }, { value: 'bottom', label: 'Bottom' },],
    ganttViewModes: [
        { value: 'Hour', label: 'Час' }, { value: 'QuarterDay', label: 'Четверть дня' },
        { value: 'HalfDay', label: 'Полдня' }, { value: 'Day', label: 'День' },
        { value: 'Week', label: 'Неделя' }, { value: 'Month', label: 'Месяц' },
        { value: 'QuarterYear', label: 'Квартал' }, { value: 'Year', label: 'Год' }
    ],
    scrollBehaviors: [{ value: 'smooth', label: 'Smooth' }, { value: 'instant', label: 'Instant' }, { value: 'auto', label: 'Auto' },],
    table2OnRowClicks: [
        { value: 'disabled', label: 'Disabled' }, { value: 'singleSelection', label: 'Single selection' },
        { value: 'expansion', label: 'Expansion' }
    ],
    table2sortTypes: [{ value: 'frontend', label: 'Frontend' }, { value: 'backend', label: 'Backend' },]
}