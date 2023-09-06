import clone from "just-clone";
import { enums } from "./enums"

const units = ['rem', '%', 'px']
/*
// groups
const General = { group: 'General' }, Data = { group: 'Data' }, Params = { group: 'Params' }, States = { group: 'States' }
const Paddings = { group: 'Paddings' }, Dimensions = { group: 'Dimensions' }, ControlledDimensions = { group: 'ControlledDimensions' }
const Icon = { group: 'Icon' }, Font = { group: 'Font' }, Form = { group: 'Form' }, Sx = { group: 'Sx' }

const oldPorts: {
    ['General']: { [key: string]: NodeInput }, ['Data']: { [key: string]: NodeInput }, ['Params']: { [key: string]: NodeInput }
    ['States']: { [key: string]: NodeInput }, ['Signals']: { [key: string]: NodeInput }, ['Style']: { [key: string]: NodeInput }
    ['Layout']: { [key: string]: NodeInput }, ['Margins']: { [key: string]: NodeInput }, ['Paddings']: { [key: string]: NodeInput }
    ['Dimensions']: { [key: string]: NodeInput }, ['ControlledDimensions']: { [key: string]: NodeInput }, ['Icon']: { [key: string]: NodeInput }
    ['Font']: { [key: string]: NodeInput }, ['Form']: { [key: string]: NodeInput }, ['Sx']: { [key: string]: NodeInput }
} = {

    Data: {
        dbClass: { group: 'Data', type: 'string', displayName: 'Database class', },

        itemId: { group: 'Data', type: 'string', displayName: 'Item id' },
        itemsIds: { group: 'Data', type: 'array', displayName: 'Items ids', tooltip: "Example: ['id1', 'id2']" },
        tableData: { group: 'Data', type: 'object', displayName: 'Table data' },

        selectedPath: { group: 'Data', type: 'string', displayName: 'Selected path' },
        value: { group: 'Data', type: 'string', displayName: 'Value' },

        inputItems: { group: 'Data', type: 'array', displayName: 'Input items' },

        customItems: { group: 'Data', type: 'array', displayName: 'Custom items', tooltip: "Example: [{ value: 'option-1', label: 'Option 1' }]" },
        selectedValue: { group: 'Data', type: 'string', displayName: 'Selected value' },

        sourceUrl: { group: 'Data', type: 'string', displayName: 'Source url' },

        createValue: { group: 'Data', type: 'string', displayName: 'Create value' },
        inputString: { group: 'Data', type: 'string', displayName: 'Input string' },
        screenshot: { group: 'Data', type: 'string', displayName: 'Screenshot' },
        message: { group: 'Data', type: 'string', displayName: 'Message' },
        uploadItems: { group: 'Data', type: 'array', displayName: 'Upload items', tooltip: "Example: [{name: ..., contentType: 'image/jpeg', data: base64}]" },
        uploadFolder: { group: 'Data', type: 'string', displayName: 'Upload folder' },
        uploadedUrls: { group: 'Data', type: 'array', displayName: 'Uploaded urls' },
        selectedDate: { group: 'Data', type: 'array', displayName: 'Selected date' },
        selectedDates: { group: 'Data', type: 'array', displayName: 'Selected dates' },
        qrString: { group: 'Data', type: 'string', displayName: 'QR string' },
    },
    Params: {
        useDataType: { ...General, type: { name: 'enum', enums: enums.useDataTypes }, displayName: 'Query type' },
        notificationsPosition: { group: 'Params', type: { name: 'enum', enums: enums.notificationsPositions }, displayName: 'Notifications position', default: 'bottom-right' },
        query: { group: 'Params', type: 'array', displayName: 'Query', tooltip: "Example: [{ content.name: { 'ta-da!!!'} }]" },
        sorts: { group: 'Params', type: 'array', displayName: 'Sorts', tooltip: "Example: [{ content.name: 'asc' }]" },
        options: { group: 'Params', type: 'array', displayName: 'Options', tooltip: "Example: [{ size: 100 }]" },

        noHeader: { group: 'Params', type: 'boolean', displayName: 'No header' },

        multipleRowSelectable: { group: 'Params', type: 'boolean', displayName: 'Multiple row selectable' },
        selectableType: { group: 'Params', type: { name: 'enum', enums: enums.selectableTypes }, displayName: 'Type', default: 'singleRow' },

        highlightSelectedRow: { group: 'Params', type: 'boolean', displayName: 'Hightlight selected row' },
        selectFirstItem: { group: 'Params', type: 'boolean', displayName: 'Select first item' },
        enableHeader: { group: 'Params', type: 'boolean', displayName: 'Header' },
        enableFooter: { group: 'Params', type: 'boolean', displayName: 'Footer' },
        enableNavbar: { group: 'Params', type: 'boolean', displayName: 'Navbar' },
        navItems: { group: 'Params', type: 'array', displayName: 'Navigation items' },

        tableScheme: { group: 'Params', type: 'array', displayName: 'Table scheme' },
        filterMaps: { group: 'Params', type: 'array', displayName: 'Filter maps' },
        offsetScrollbars: { group: 'Params', type: 'boolean', displayName: 'Offset scrollbars' },

        qrCodeLevel: { group: 'Params', type: { name: 'enum', enums: enums.qrCodeLevels }, displayName: 'QR code level', default: 'L' },
        dateFormat: { group: 'Params', type: 'string', displayName: 'Date format', default: 'YYYY-MM-DD HH:mm' },
        limitMinDate: { group: 'Params', type: 'boolean', displayName: 'Limit minimal date', default: false },
        daysOffset: { group: 'Params', type: 'number', displayName: 'Minimum days offset', default: 0, tooltip: 'Number of days to offset. Negative for past offset' },
        labelField: { group: 'Params', type: 'string', displayName: 'Label field' },
        searchable: { group: 'Params', type: 'boolean', displayName: 'Searchable' },
        clearable: { group: 'Params', type: 'boolean', displayName: 'Clearable' },
        creatable: { group: 'Params', type: 'boolean', displayName: 'Creatable' },


        autoClose: { group: 'Params', type: 'number', displayName: 'Autoclose (ms)', default: 2000 },
        useCustomItems: { group: 'Params', type: 'boolean', displayName: 'Use custom items', default: false },
        withArrow: { group: 'Params', type: 'boolean', displayName: 'With arrow' },
        datePickerType: { group: 'Params', type: { name: 'enum', enums: enums.datePickerTypes }, displayName: 'Type', default: 'default' },
        inline: { group: 'Params', type: 'boolean', displayName: 'Inline' },
        screenshotEnabled: { group: 'Params', type: 'boolean', displayName: 'Enable screenshot' },
        maxScansPerSecond: { group: 'Params', type: 'number', displayName: 'Max scans per second', default: 25 },

    },
    States: {
        enabled: { group: 'States', type: 'boolean', displayName: 'Enabled' },


        searchEnabled: { group: 'States', type: 'boolean', displayName: 'Search enabled' },
        uploading: { group: 'States', type: 'boolean', displayName: 'Uploading' },
        processing: { group: 'States', type: 'boolean', displayName: 'Processing' },
    },
    Signals: {
        inited: { group: 'Signals', type: 'signal', displayName: 'Inited' },
        loaded: { group: 'Signals', type: 'signal', displayName: 'Loaded' },

        resetSelected: { group: 'Signals', type: 'signal', displayName: 'Reset selected' },

        doDelete: { group: 'Signals', type: 'signal', displayName: 'Delete' },
        pathChanged: { group: 'Signals', type: 'signal', displayName: 'Path changed' },
        authenticated: { group: 'Signals', type: 'signal', displayName: 'Authenticated' },
        viewItem: { group: 'Signals', type: 'signal', displayName: 'View item clicked' },
        editItem: { group: 'Signals', type: 'signal', displayName: 'Edit item clicked' },
        viewImages: { group: 'Signals', type: 'signal', displayName: 'View images' },

        hide: { group: 'Signals', type: 'boolean', displayName: 'Hide' },

        create: { group: 'Signals', type: 'signal', displayName: 'Create' },
        screenshoted: { group: 'Signals', type: 'signal', displayName: 'Screenshoted' },
        uploaded: { group: 'Signals', type: 'signal', displayName: 'Uploaded' },
        jwtValidationFailed: { group: 'Signals', type: 'signal', displayName: 'JWT validation failed' },
        qrScanned: { group: 'Signals', type: 'signal', displayName: 'QR scanned' },
    },
    Style: {
        detectColorScheme: { group: 'Style', type: 'boolean', displayName: 'Autodetect color scheme', },
        colorScheme: { group: 'Style', type: { name: 'enum', enums: enums.colorSchemes }, displayName: 'Default color scheme' },

        borderRadius: { group: 'Style', type: { name: 'enum', enums: enums.sizes }, displayName: 'Border radius' },

        buttonColor: { group: 'Style', type: { name: 'enum', enums: enums.colors }, displayName: 'Button color' },

        striped: { group: 'Style', type: 'boolean', displayName: 'Striped' },
        loaderVariant: { group: 'Style', type: { name: 'enum', enums: enums.loaderVariants }, displayName: 'Variant' },
        avatarVariant: { group: 'Style', type: { name: 'enum', enums: enums.avatarVariants }, displayName: 'Variant' },
        badgeVariant: { group: 'Style', type: { name: 'enum', enums: enums.badgeVariants }, displayName: 'Variant', default: 'light' },
    },
    
    Paddings: {
        p: { ...Paddings, type: { name: 'enum', enums: enums.sizes }, displayName: 'Padding' },
        pt: { ...Paddings, type: { name: 'enum', enums: enums.sizes }, displayName: 'Padding top' },
        pr: { ...Paddings, type: { name: 'enum', enums: enums.sizes }, displayName: 'Padding right' },
        pb: { ...Paddings, type: { name: 'enum', enums: enums.sizes }, displayName: 'Padding bottom' },
        pl: { ...Paddings, type: { name: 'enum', enums: enums.sizes }, displayName: 'Padding left' },
    },
    Layout: {
        verticalSpacing: { group: '', type: { name: 'enum', enums: enums.sizes }, displayName: 'Vertical spacing' },
        spacing: { group: '', type: { name: 'enum', enums: enums.sizes }, displayName: 'Spacing' },
        stackAlign: { group: '', type: { name: 'enum', enums: enums.stackAligns }, displayName: 'Align' },
        stackJustify: { group: '', type: { name: 'enum', enums: enums.stackJustifies }, displayName: 'Justify' },
        position: { group: '', type: { name: 'enum', enums: enums.positions }, displayName: 'Position' },
        popoverPosition: { group: '', type: { name: 'enum', enums: enums.popoverPositions }, displayName: 'Position' },
        indicatorPosition: { group: '', type: { name: 'enum', enums: enums.indicatorPositions }, displayName: 'Position', default: 'top-end' },
        grow: { group: '', type: 'boolean', displayName: 'Grow' },
        orientation: { group: '', type: 'boolean', displayName: 'Vertical', default: false },
        bottomOffset: { group: '', type: 'number', displayName: 'Bottom offset', default: 0 },

        gutter: { group: '', type: { name: 'enum', enums: enums.sizes }, displayName: 'Gutter' },
        spans: { group: '', type: 'array', displayName: 'Spans', tooltip: "Example: [4,4,4] One row = 12. Can be number, auto, content" },
        direction: { group: '', type: { name: 'enum', enums: enums.directions }, displayName: 'Direction', },
        dropdownType: { group: '', type: { name: 'enum', enums: enums.dropdownTypes }, displayName: 'Dropdown type', default: 'popover' },
    },
    Dimensions: {

        maw: { group: 'Dimensions', type: { name: 'number', units, defaultUnit: 'rem' }, displayName: 'Max width' },

        sizeString: { group: 'Dimensions', type: 'string', displayName: 'Size string' },
        sizeNumber: { group: 'Dimensions', type: 'number', displayName: 'Size number' },
    },
    Icon: {
        iconName: { group: 'Icon', type: 'string', displayName: 'Icon name', tooltip: 'Find icon at tabler-icons.io and capitalize it: "IconSuperName"' },
        iconSize: { group: 'Icon', type: { name: 'number', units, defaultUnit: 'rem' }, displayName: 'Icon size' },
        stroke: { group: 'Icon', type: 'number', displayName: 'Stroke' },
    },
    ControlledDimensions: {
        widthString: { ...ControlledDimensions, type: 'string', displayName: 'Width (string)' },
        heightString: { ...ControlledDimensions, type: 'string', displayName: 'Height (string)' },
        widthNumber: { ...ControlledDimensions, type: 'number', displayName: 'Width (number)' },
        heightNumber: { ...ControlledDimensions, type: 'number', displayName: 'Height (number)' },
    },

    Sx: {
        minHeight: { ...Sx, type: { name: 'number', units, defaultUnit: 'rem' }, displayName: 'Min height' },
        fontSize: { ...Sx, type: { name: 'enum', enums: enums.sizes }, displayName: 'Font size' },
        customSx: { ...Sx, type: 'array', displayName: 'Custom sx', tooltip: "Example: [{ width: 100 }]" },
        backgroundColor: { ...Sx, type: { name: 'enum', enums: enums.colors }, displayName: 'Background color' },
        colorShade: { ...Sx, type: { name: 'enum', enums: enums.colorShades }, displayName: 'Color shade', default: '6' },
    }
}

const jsPorts: { [key: string]: { [key: string]: NodeInput } } = {
    Data: {
        createItem: { group: 'Data', type: 'object', displayName: 'Create item', tooltip: "Example: {dbClass: 'task', body: {...}}" },
        createdItem: { group: 'Data', type: 'object', displayName: 'Created item' },
        createItems: { group: 'Data', type: 'object', displayName: 'Create items', tooltip: "Example: { dbClass: 'task', items: [{body: {...} }] }" },
        createdItems: { group: 'Data', type: 'array', displayName: 'Created items' },
        updateItem: { group: 'Data', type: 'object', displayName: 'Update item', tooltip: "Example: { dbClass: 'task', id: 'task id', body: {...} }" },
        updatedItem: { group: 'Data', type: 'object', displayName: 'Updated item' },
        updateItems: { group: 'Data', type: 'object', displayName: 'Update items', tooltip: "Example: { dbClass: 'task', items: [{id: 'id', body: {...} }] }" },
        updatedItems: { group: 'Data', type: 'array', displayName: 'Updated items' },
        deleteItems: { group: 'Data', type: 'array', displayName: 'Delete items', tooltip: "Example: { dbClass: 'task', itemsIds: ['id1'] }" },
        createUserItem: { group: 'Data', type: 'object', displayName: 'Create user item', tooltip: "Example: {body: {content: {...}, credentials: {...}}}" },
        createdUserItem: { group: 'Data', type: 'object', displayName: 'Created user item' },
        deleteUserIds: { group: 'Data', type: 'array', displayName: 'Delete user ids', tooltip: "Example: ['kuid1', 'kuid2']" },
        filteredItems: { group: 'Data', type: 'array', displayName: 'Filtered items' },
    },
    States: {
        creating: { group: 'States', type: 'boolean', displayName: 'Creating' },
        updating: { group: 'States', type: 'boolean', displayName: 'Updating' },
        deleting: { group: 'States', type: 'boolean', displayName: 'Deleting' },
    },
    Signals: {


        created: { group: 'Signals', type: 'signal', displayName: 'Created' },
        updated: { group: 'Signals', type: 'signal', displayName: 'Updated' },
        deleted: { group: 'Signals', type: 'signal', displayName: 'Deleted' },
    },
    Params: {
        dbClass: { group: 'Params', type: 'string', displayName: 'Database class', },
        refDbClass: { group: 'Params', type: 'string', displayName: 'Reference database class', },
        reversedRef: { group: 'Params', type: 'boolean', displayName: 'Reversed reference', default: false },
    }
} */

const ports = [
    // Data
    { name: 'items', group: 'Data', type: { name: 'array', allowConnectionsOnly: true }, displayName: 'Items' },
    { name: 'selectedItem', group: 'Data', type: 'object', displayName: 'Selected item' },
    { name: 'selectedItems', group: 'Data', type: 'array', displayName: 'Selected items' },
    { name: 'value', group: 'Data', type: 'string', displayName: 'Value' },
    { name: 'typedValue', group: 'Data', type: { name: 'string', allowConnectionsOnly: true }, displayName: 'Typed value' },
    { name: 'actionItem', group: 'Data', type: 'object', displayName: 'Action item' },
    { name: 'searchString', group: 'Data', type: 'string', displayName: 'Search string' },
    { name: 'foundedData', group: 'Data', type: 'object', displayName: 'Founded data' },
    // Form
    { name: 'useForm', group: 'Form', type: 'boolean', displayName: 'Use form' },
    { name: 'formField', group: 'Form', type: 'string', displayName: 'Form field', dependsOn: 'useForm' },
    { name: 'formHook', group: 'Form', type: 'object', displayName: 'Form hook', dependsOn: 'useForm' },
    { name: 'formHookAtForm', group: 'Form', type: 'object', displayName: 'Form hook' },
    // States
    { name: 'disabled', group: 'States', type: 'boolean', displayName: 'Disabled', default: false },
    { name: 'loading', group: 'States', type: 'boolean', displayName: 'Loading', default: false },
    { name: 'searching', group: 'States', type: 'boolean', displayName: 'Searching', default: false },
    { name: 'checked', group: 'States', type: 'boolean', displayName: 'Checked', default: false },
    // Icon
    { name: 'iconName', group: 'Icon', type: 'string', displayName: 'Icon name', tooltip: 'Find icon at tabler-icons.io and capitalize it: "IconSuperName"' },
    { name: 'iconSize', group: 'Icon', type: { name: 'number', units, defaultUnit: 'rem' }, displayName: 'Icon size' },
    { name: 'stroke', group: 'Icon', type: 'number', displayName: 'Stroke' },
    // Params
    { name: 'columns', group: 'Params', type: 'array', displayName: 'Columns' },
    { name: 'grouped', group: 'Params', type: 'boolean', displayName: 'Grouped', default: false, },
    { name: 'selectable', group: 'Params', type: 'boolean', displayName: 'Selectable', default: false, },
    { name: 'singleSelect', group: 'Params', type: 'boolean', displayName: 'Single select', default: false, dependsOn: 'selectable' },
    { name: 'singleUnselectable', group: 'Params', type: 'boolean', displayName: 'Single unselectable', default: false, dependsOn: 'singleSelect' },
    { name: 'multiSelect', group: 'Params', type: 'boolean', displayName: 'Multi select', default: false, dependsOn: 'selectable' },
    { name: 'allSelect', group: 'Params', type: 'boolean', displayName: 'All select', default: true, dependsOn: 'multiSelect' },
    { name: 'formScheme', group: 'Params', type: 'array', displayName: 'Form scheme', isObject: true, tooltip: "Example: {name: 'startDate', initialValue: new Date(), validate: isNotEmpty}" },
    { name: 'title', group: 'Params', type: 'string', displayName: 'Title' },
    { name: 'label', group: 'Params', type: 'string', displayName: 'Label' },
    { name: 'placeholder', group: 'Params', type: 'string', displayName: 'Placeholder' },
    { name: 'description', group: 'Params', type: 'string', displayName: 'Description' },
    { name: 'error', group: 'Params', type: 'string', displayName: 'Error' },
    { name: 'mask', group: 'Params', type: 'string', displayName: 'Mask', default: '{8} (000) 000-00-00', tooltip: "IMask js lib mask" },
    { name: 'hideMask', group: 'Params', type: 'boolean', displayName: 'Hide mask', default: false },
    { name: 'overwrite', group: 'Params', type: 'boolean', displayName: 'Overwrite', default: true },
    { name: 'debounced', group: 'Params', type: 'boolean', displayName: 'Debounced', default: false, tooltip: 'Delay typed value' },
    { name: 'delay', group: 'Params', type: 'number', displayName: 'Delay (ms)', default: 350, dependsOn: 'debounced' },
    { name: 'buttonType', group: 'Params', type: { name: 'enum', enums: enums.buttonTypes }, displayName: 'Button type', tooltip: '"Submit" to trigger form' },
    { name: 'expandAllAction', group: 'Params', type: 'boolean', displayName: 'Expand all', default: true, dependsOn: 'grouped' },
    { name: 'drawerHeaderEnabled', group: 'Params', type: 'boolean', displayName: 'Header', default: false },
    { name: 'closeActionEnabled', group: 'Params', type: 'boolean', displayName: 'Enable close action', default: false, dependsOn: 'drawerHeaderEnabled' },
    { name: 'drawerTitle', group: 'Params', type: 'string', displayName: 'Drawer title', dependsOn: 'drawerHeaderEnabled' },
    { name: 'options', group: 'Params', type: 'array', displayName: 'Options', isObject: true, tooltip: "Example: [{ size: 100 }]" },
    { name: 'masked', group: 'Params', type: 'boolean', displayName: 'Masked', default: false },
    { name: 'textMask', group: 'Params', type: 'string', displayName: 'Mask', default: '{8} (000) 000-00-00', tooltip: "IMask js lib mask", dependsOn: 'masked' },
    // Proplists
    { name: 'dbClasses', group: 'Database classes', type: 'proplist', displayName: 'Database classes' },
    { name: 'searchFields', group: 'Search fields', type: 'proplist', displayName: 'Search fields', tooltip: "Example: content.name.search" },
    // Signals
    { name: 'expandAll', group: 'Signals', type: 'signal', displayName: 'Expand all rows' },
    { name: 'unExpandAll', group: 'Signals', type: 'signal', displayName: 'Unexpand all rows' },
    { name: 'singleSelected', group: 'Signals', type: 'signal', displayName: 'Single selected' },
    { name: 'initBackend', group: 'Signals', type: 'signal', displayName: 'Initialize backend' },
    { name: 'jwtValidationFailed', group: 'Signals', type: 'signal', displayName: 'JWT validation failed' },
    { name: 'jwtValidationSucceed', group: 'Signals', type: 'signal', displayName: 'JWT validation succeed' },
    { name: 'actionName', group: 'Signals', type: 'string', displayName: 'Action name' },
    { name: 'submited', group: 'Signals', type: 'signal', displayName: 'Submited' },
    { name: 'open', group: 'Signals', type: 'signal', displayName: 'Open' },
    { name: 'close', group: 'Signals', type: 'signal', displayName: 'Close' },
    { name: 'hided', group: 'Signals', type: 'signal', displayName: 'Hided' },
    { name: 'closed', group: 'Signals', type: 'signal', displayName: 'Closed' },
    { name: 'clicked', group: 'Signals', type: 'signal', displayName: 'Clicked' },
    { name: 'resetSingleSelected', group: 'Signals', type: 'signal', displayName: 'Reset single selected' },
    { name: 'resetMultipleSelected', group: 'Signals', type: 'signal', displayName: 'Reset multiple selected' },
    { name: 'completed', group: 'Signals', type: 'signal', displayName: 'Completed' },
    // Margins
    { name: 'margins', group: 'Margins', type: 'boolean', displayName: 'Margins' },
    { name: 'm', group: 'Margins', type: { name: 'enum', enums: enums.sizes }, displayName: 'Margin', dependsOn: 'margins' },
    { name: 'mx', group: 'Margins', type: { name: 'enum', enums: enums.sizes }, displayName: 'Margin x-axis', dependsOn: 'margins' },
    { name: 'my', group: 'Margins', type: { name: 'enum', enums: enums.sizes }, displayName: 'Margin y-axis', dependsOn: 'margins' },
    { name: 'mt', group: 'Margins', type: { name: 'enum', enums: enums.sizes }, displayName: 'Margin top', dependsOn: 'margins' },
    { name: 'mr', group: 'Margins', type: { name: 'enum', enums: enums.sizes }, displayName: 'Margin right', dependsOn: 'margins' },
    { name: 'mb', group: 'Margins', type: { name: 'enum', enums: enums.sizes }, displayName: 'Margin bottom', dependsOn: 'margins' },
    { name: 'ml', group: 'Margins', type: { name: 'enum', enums: enums.sizes }, displayName: 'Margin left', dependsOn: 'margins' },
    // Font    
    { name: 'drawerTitleOrder', group: 'Font', type: 'number', displayName: 'Order', tooltip: '1 - 6', dependsOn: 'drawerHeaderEnabled', default: 4 },
    { name: 'titleOrder', group: 'Font', type: 'number', displayName: 'Order', tooltip: '1 - 6', default: 3 },
    { name: 'fz', group: 'Font', type: { name: 'enum', enums: enums.sizes }, displayName: 'Size', default: 'md' },
    { name: 'fw', group: 'Font', type: { name: 'enum', enums: enums.fontWeights }, displayName: 'Weight' },
    // Style
    //// colors
    { name: 'color', group: 'Style', type: 'string', displayName: 'Color', tooltip: 'red, red.5' },
    { name: 'loaderColor', group: 'Style', type: 'string', displayName: 'Loader color', tooltip: 'red, red.5' },
    { name: 'backgroundColor', group: 'Style', type: 'string', displayName: 'Background color', tooltip: 'red, red.5' },
    { name: 'onHoverColor', group: 'Style', type: 'string', displayName: 'On hover color', tooltip: 'red, red.5', dependsOn: 'highlightOnHover' },
    { name: 'selectedColor', group: 'Style', type: 'string', displayName: 'Selected color', tooltip: 'red, red.5', dependsOn: 'highlightSelected' },
    { name: 'multiSelectCheckboxColor', group: 'Style', type: 'string', displayName: 'Checkbox color', tooltip: 'red, red.5', dependsOn: 'multiSelect' },
    ////
    { name: 'highlightOnHover', group: 'Style', type: 'boolean', displayName: 'Hightlight on hover', default: false },
    { name: 'highlightSelected', group: 'Params', type: 'boolean', displayName: 'Hightlight selected', default: false, dependsOn: 'singleSelect' },
    { name: 'withBorder', group: 'Style', type: 'boolean', displayName: 'With border' },
    { name: 'shadow', group: 'Style', type: { name: 'enum', enums: enums.sizes }, displayName: 'Shadow', default: 'sm' },
    { name: 'withColumnBorders', group: 'Style', type: 'boolean', displayName: 'Column borders' },
    { name: 'radius', group: 'Style', type: { name: 'enum', enums: enums.sizes }, displayName: 'Radius', default: 'md' },
    { name: 'opacity', group: 'Style', type: 'number', displayName: 'Opacity' },
    { name: 'withAsterisk', group: 'Style', type: 'boolean', displayName: 'With asterisk' },
    { name: 'dividerVariant', group: 'Style', type: { name: 'enum', enums: enums.dividerVariants }, displayName: 'Variant', default: 'solid' },
    { name: 'buttonVariant', group: 'Style', type: { name: 'enum', enums: enums.buttonVariants }, displayName: 'Variant', default: 'filled' },
    // Layout
    { name: 'tableDensity', group: 'Table layout', type: { name: 'enum', enums: enums.tableDensities }, displayName: 'Density', default: 'xs' },
    { name: 'labelPosition', group: 'Layout', type: { name: 'enum', enums: enums.labelPositions }, displayName: 'Label position', default: 'right' },
    { name: 'drawerPosition', group: 'Layout', type: { name: 'enum', enums: enums.drawerPositions }, displayName: 'Position', default: 'right' },
    { name: 'dividerLabelPosition', group: 'Layout', type: { name: 'enum', enums: enums.dividerLabelPositions }, displayName: 'Label position', default: 'left' },
    { name: 'dividerOrientation', group: 'Layout', type: { name: 'enum', enums: enums.dividerOrientations }, displayName: 'Orientation', default: 'horizontal' },
    // Dimensions        
    { name: 'loaderSize', group: 'Dimensions', type: { name: 'enum', enums: enums.sizes }, displayName: 'Loader size', default: 'lg' },
    { name: 'size', group: 'Dimensions', type: { name: 'enum', enums: enums.sizes }, displayName: 'Size', default: 'sm' },
    { name: 'sizeUnits', group: 'Dimensions', type: { name: 'number', units, defaultUnit: 'rem' }, displayName: 'Size' },
    { name: 'w', group: 'Dimensions', type: { name: 'number', units, defaultUnit: 'rem' }, displayName: 'Width' },
    { name: 'h', group: 'Dimensions', type: { name: 'number', units, defaultUnit: 'rem' }, displayName: 'Height' },
    // Fonr titleOrder
] as const satisfies readonly NodePort[];

type PortsNames = typeof ports[number]['name']

export const groupedPorts = {
    'Margins': ['margins', 'm', 'my', 'mx', 'mt', 'mr', 'mb', 'ml'],
    'Table params': ['columns', 'grouped', 'selectable', 'singleSelect', 'singleUnselectable', 'multiSelect', 'allSelect', 'expandAllAction'],
    'Table layout': ['tableDensity'],
    'Table style': ['loaderSize', 'loaderColor', 'withBorder', 'shadow', 'withColumnBorders', 'radius'],
    'Rows style': ['highlightOnHover', 'onHoverColor', 'backgroundColor', 'highlightSelected', 'selectedColor', 'multiSelectCheckboxColor'],
    'Form': ['useForm', 'formField', 'formHook'],
    'Icon': ['iconName', 'iconSize', 'stroke'],
    'Font': ['fz', 'fw']
} satisfies Record<string, PortsNames[]>;
type GroupedPortsNames = keyof typeof groupedPorts

type GroupsNames = typeof ports[number]['group']
type GetPorts = {
    type: 'input' | 'output'
    portsNames?: PortsNames[]
    requiredInputs?: PortsNames[]
    groupsNames?: GroupsNames[]
    customs?: { groupName?: string }
}
export function getPorts(props: GetPorts): NodePort[] {
    return ports.filter((i: any) =>
        props.portsNames?.includes(i.name) ||
        props.groupsNames?.includes(i.group)
    ).map((i: any) => {
        i.plug = props.type
        if (props.customs?.groupName) i.group = props.customs?.groupName
        if (props.requiredInputs?.includes(i.name)) i.required = true
        return clone(i)
    })
}

type GetGroupedPorts = { type: 'input' | 'output', groupsNames: GroupedPortsNames[], requiredInputs?: PortsNames[] }
export function getGroupedPorts(props: GetGroupedPorts): NodePort[] {
    let resultPorts: NodePort[] = []
    props.groupsNames.forEach(groupName => {
        resultPorts = resultPorts.concat(getPorts({
            type: props.type,
            portsNames: groupedPorts[groupName],
            requiredInputs: props.requiredInputs,
            customs: { groupName }
        }))
    })
    return resultPorts
}
