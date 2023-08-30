import { NodeInput, Type } from "@noodl/noodl-sdk"
import { enums } from "./enums"

const units = ['rem', '%', 'px']
// types
const string: { type: Type } = { type: 'string' }
const number: { type: Type } = { type: 'number' }
const boolean: { type: Type } = { type: 'boolean' }
const array: { type: Type } = { type: 'array' }
const object: { type: Type } = { type: 'object' }
const signal: { type: Type } = { type: 'signal' }
// groups
const General = { group: 'General' }, Data = { group: 'Data' }, Params = { group: 'Params' }, States = { group: 'States' }
const Signals = { group: 'Signals' }, Style = { group: 'Style' }, Layout = { group: 'Layout' }, Margins = { group: 'Margins' }
const Paddings = { group: 'Paddings' }, Dimensions = { group: 'Dimensions' }, ControlledDimensions = { group: 'ControlledDimensions' }
const Icon = { group: 'Icon' }, Font = { group: 'Font' }, Form = { group: 'Form' }, Sx = { group: 'Sx' }

const oldPorts: {
    ['General']: { [key: string]: NodeInput }, ['Data']: { [key: string]: NodeInput }, ['Params']: { [key: string]: NodeInput }
    ['States']: { [key: string]: NodeInput }, ['Signals']: { [key: string]: NodeInput }, ['Style']: { [key: string]: NodeInput }
    ['Layout']: { [key: string]: NodeInput }, ['Margins']: { [key: string]: NodeInput }, ['Paddings']: { [key: string]: NodeInput }
    ['Dimensions']: { [key: string]: NodeInput }, ['ControlledDimensions']: { [key: string]: NodeInput }, ['Icon']: { [key: string]: NodeInput }
    ['Font']: { [key: string]: NodeInput }, ['Form']: { [key: string]: NodeInput }, ['Sx']: { [key: string]: NodeInput }
} = {
    General: {

    },
    Data: {
        dbClass: { group: 'Data', type: 'string', displayName: 'Database class', },
        dbClasses: { group: 'Data', type: 'array', displayName: 'Database classes', },
        itemId: { group: 'Data', type: 'string', displayName: 'Item id' },
        itemsIds: { group: 'Data', type: 'array', displayName: 'Items ids', tooltip: "Example: ['id1', 'id2']" },
        tableData: { group: 'Data', type: 'object', displayName: 'Table data' },
        foundedData: { group: 'Data', type: 'object', displayName: 'Founded data' },

        selectedPath: { group: 'Data', type: 'string', displayName: 'Selected path' },
        value: { group: 'Data', type: 'string', displayName: 'Value' },
        searchString: { group: 'Data', type: 'string', displayName: 'Search string' },
        inputItems: { group: 'Data', type: 'array', displayName: 'Input items' },

        customItems: { group: 'Data', type: 'array', displayName: 'Custom items', tooltip: "Example: [{ value: 'option-1', label: 'Option 1' }]" },
        selectedValue: { group: 'Data', type: 'string', displayName: 'Selected value' },
        title: { group: 'Data', type: 'string', displayName: 'Title' },

        sourceUrl: { group: 'Data', type: 'string', displayName: 'Source url' },
        placeholder: { group: 'Data', type: 'string', displayName: 'Placeholder' },
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
        searchFields: { group: 'Params', type: 'array', displayName: 'Search fields', tooltip: "Example: ['content.name.search']" },
        tableScheme: { group: 'Params', type: 'array', displayName: 'Table scheme' },
        filterMaps: { group: 'Params', type: 'array', displayName: 'Filter maps' },
        offsetScrollbars: { group: 'Params', type: 'boolean', displayName: 'Offset scrollbars' },
        withCloseButton: { group: 'Params', type: 'boolean', displayName: 'With close button', default: false, tooltip: "Hides close button and title" },
        formScheme: { group: 'Params', type: 'array', displayName: 'Form scheme', tooltip: "Example: [{name: 'startDate', initialValue: new Date(), validate: isNotEmpty}]" },
        buttonType: { group: 'Params', type: { name: 'enum', enums: enums.buttonTypes }, displayName: 'Button type', tooltip: '"Submit" to trigger form' },
        qrCodeLevel: { group: 'Params', type: { name: 'enum', enums: enums.qrCodeLevels }, displayName: 'QR code level', default: 'L' },
        withAsterisk: { group: 'Params', type: 'boolean', displayName: 'With asterisk' },
        dateFormat: { group: 'Params', type: 'string', displayName: 'Date format', default: 'YYYY-MM-DD HH:mm' },
        limitMinDate: { group: 'Params', type: 'boolean', displayName: 'Limit minimal date', default: false },
        daysOffset: { group: 'Params', ...number, displayName: 'Minimum days offset', default: 0, tooltip: 'Number of days to offset. Negative for past offset' },
        labelField: { group: 'Params', type: 'string', displayName: 'Label field' },
        searchable: { group: 'Params', type: 'boolean', displayName: 'Searchable' },
        clearable: { group: 'Params', type: 'boolean', displayName: 'Clearable' },
        creatable: { group: 'Params', type: 'boolean', displayName: 'Creatable' },
        debounced: { group: 'Params', type: 'boolean', displayName: 'Debounced', default: false, tooltip: 'Delay typed string at output' },
        delay: { group: 'Params', ...number, displayName: 'Delay (ms)', default: 350 },
        autoClose: { group: 'Params', ...number, displayName: 'Autoclose (ms)', default: 2000 },
        useCustomItems: { group: 'Params', type: 'boolean', displayName: 'Use custom items', default: false },
        withArrow: { group: 'Params', type: 'boolean', displayName: 'With arrow' },
        datePickerType: { group: 'Params', type: { name: 'enum', enums: enums.datePickerTypes }, displayName: 'Type', default: 'default' },
        inline: { group: 'Params', type: 'boolean', displayName: 'Inline' },
        screenshotEnabled: { group: 'Params', type: 'boolean', displayName: 'Enable screenshot' },
        maxScansPerSecond: { group: 'Params', ...number, displayName: 'Max scans per second', default: 25 },

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
        resetSingleSelected: { group: 'Signals', type: 'boolean', displayName: 'Reset single selected' },
        resetMultipleSelected: { group: 'Signals', type: 'boolean', displayName: 'Reset multiple selected' },
        doDelete: { group: 'Signals', type: 'signal', displayName: 'Delete' },
        pathChanged: { group: 'Signals', type: 'signal', displayName: 'Path changed' },
        authenticated: { group: 'Signals', type: 'signal', displayName: 'Authenticated' },
        viewItem: { group: 'Signals', type: 'signal', displayName: 'View item clicked' },
        editItem: { group: 'Signals', type: 'signal', displayName: 'Edit item clicked' },
        viewImages: { group: 'Signals', type: 'signal', displayName: 'View images' },
        clicked: { group: 'Signals', type: 'signal', displayName: 'Clicked' },
        show: { group: 'Signals', type: 'boolean', displayName: 'Show' },
        hided: { group: 'Signals', type: 'signal', displayName: 'Hided' },
        hide: { group: 'Signals', type: 'boolean', displayName: 'Hide' },
        submited: { group: 'Signals', type: 'signal', displayName: 'Submited' },
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
        opacity: { group: 'Style', ...number, displayName: 'Opacity' },

        actionVariant: { group: 'Style', type: { name: 'enum', enums: enums.actionVariants }, displayName: 'Variant' },
        striped: { group: 'Style', type: 'boolean', displayName: 'Striped' },
        loaderVariant: { group: 'Style', type: { name: 'enum', enums: enums.loaderVariants }, displayName: 'Variant' },
        avatarVariant: { group: 'Style', type: { name: 'enum', enums: enums.avatarVariants }, displayName: 'Variant' },
        badgeVariant: { group: 'Style', type: { name: 'enum', enums: enums.badgeVariants }, displayName: 'Variant', default: 'light' },
    },
    Margins: {

    },
    Paddings: {
        p: { ...Paddings, type: { name: 'enum', enums: enums.sizes }, displayName: 'Padding' },
        pt: { ...Paddings, type: { name: 'enum', enums: enums.sizes }, displayName: 'Padding top' },
        pr: { ...Paddings, type: { name: 'enum', enums: enums.sizes }, displayName: 'Padding right' },
        pb: { ...Paddings, type: { name: 'enum', enums: enums.sizes }, displayName: 'Padding bottom' },
        pl: { ...Paddings, type: { name: 'enum', enums: enums.sizes }, displayName: 'Padding left' },
    },
    Layout: {
        verticalSpacing: { ...Layout, type: { name: 'enum', enums: enums.sizes }, displayName: 'Vertical spacing' },
        spacing: { ...Layout, type: { name: 'enum', enums: enums.sizes }, displayName: 'Spacing' },
        stackAlign: { ...Layout, type: { name: 'enum', enums: enums.stackAligns }, displayName: 'Align' },
        stackJustify: { ...Layout, type: { name: 'enum', enums: enums.stackJustifies }, displayName: 'Justify' },
        position: { ...Layout, type: { name: 'enum', enums: enums.positions }, displayName: 'Position' },
        popoverPosition: { ...Layout, type: { name: 'enum', enums: enums.popoverPositions }, displayName: 'Position' },
        indicatorPosition: { ...Layout, type: { name: 'enum', enums: enums.indicatorPositions }, displayName: 'Position', default: 'top-end' },
        grow: { ...Layout, type: 'boolean', displayName: 'Grow' },
        orientation: { ...Layout, type: 'boolean', displayName: 'Vertical', default: false },
        bottomOffset: { ...Layout, ...number, displayName: 'Bottom offset', default: 0 },
        drawerPosition: { ...Layout, type: { name: 'enum', enums: enums.drawerPositions }, displayName: 'Position' },
        gutter: { ...Layout, type: { name: 'enum', enums: enums.sizes }, displayName: 'Gutter' },
        spans: { ...Layout, type: 'array', displayName: 'Spans', tooltip: "Example: [4,4,4] One row = 12. Can be number, auto, content" },
        direction: { ...Layout, type: { name: 'enum', enums: enums.directions }, displayName: 'Direction', },
        dropdownType: { ...Layout, type: { name: 'enum', enums: enums.dropdownTypes }, displayName: 'Dropdown type', default: 'popover' },
    },
    Dimensions: {
        w: { group: 'Dimensions', type: { name: 'number', units, defaultUnit: 'rem' }, displayName: 'Width' },
        maw: { group: 'Dimensions', type: { name: 'number', units, defaultUnit: 'rem' }, displayName: 'Max width' },
        h: { group: 'Dimensions', type: { name: 'number', units, defaultUnit: 'rem' }, displayName: 'Height' },

        sizeUnits: { group: 'Dimensions', type: { name: 'number', units, defaultUnit: 'rem' }, displayName: 'Size' },
        sizeString: { group: 'Dimensions', type: 'string', displayName: 'Size string' },
        sizeNumber: { group: 'Dimensions', ...number, displayName: 'Size number' },
    },
    Icon: {
        iconName: { ...Icon, type: 'string', displayName: 'Icon name', tooltip: 'Find icon at tabler-icons.io and capitalize it: "IconSuperName"' },
        iconSize: { ...Icon, type: { name: 'number', units, defaultUnit: 'rem' }, displayName: 'Icon size' },
        stroke: { ...Icon, ...number, displayName: 'Stroke' },
    },
    ControlledDimensions: {
        widthString: { ...ControlledDimensions, type: 'string', displayName: 'Width (string)' },
        heightString: { ...ControlledDimensions, type: 'string', displayName: 'Height (string)' },
        widthNumber: { ...ControlledDimensions, ...number, displayName: 'Width (number)' },
        heightNumber: { ...ControlledDimensions, ...number, displayName: 'Height (number)' },
    },
    Font: {
        fz: { ...Font, type: { name: 'enum', enums: enums.sizes }, displayName: 'Size' },
        fw: { ...Font, type: { name: 'enum', enums: enums.fontWeights }, displayName: 'Weight' },
    },
    Form: {
        useForm: { ...Form, type: 'boolean', displayName: 'Use form' },
        formField: { ...Form, type: 'string', displayName: 'Form field' },
        formHook: { ...Form, type: 'object', displayName: 'Form hook' },
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
}

const ports = [
    // Data
    { name: 'items', group: 'Data', type: 'array', displayName: 'Items' },
    { name: 'selectedItem', group: 'Data', type: 'object', displayName: 'Selected item' },
    { name: 'selectedItems', group: 'Data', type: 'array', displayName: 'Selected items' },
    { name: 'label', group: 'Data', type: 'string', displayName: 'Label' },
    { name: 'description', group: 'Data', type: 'string', displayName: 'Description' },
    { name: 'error', group: 'Data', type: 'string', displayName: 'error' },
    // States
    { name: 'disabled', group: 'States', type: 'boolean', displayName: 'Disabled', default: false },
    { name: 'loading', group: 'States', type: 'boolean', displayName: 'Loading', default: false },
    { name: 'searching', group: 'States', type: 'boolean', displayName: 'Searching', default: false },
    { name: 'checked', group: 'States', type: 'boolean', displayName: 'Checked', default: false },
    // Params
    { name: 'columns', group: 'Params', type: 'object', displayName: 'Columns' },
    { name: 'grouped', group: 'Params', type: 'boolean', displayName: 'Grouped', default: false, },
    { name: 'selectable', group: 'Params', type: 'boolean', displayName: 'Selectable', default: false, },
    { name: 'singleSelect', group: 'Params', type: 'boolean', displayName: 'Single select', default: false, dependsOn: 'selectable' },
    { name: 'multiSelect', group: 'Params', type: 'boolean', displayName: 'Multi select', default: false, dependsOn: 'selectable' },
    { name: 'allSelect', group: 'Params', type: 'boolean', displayName: 'All select', default: false, dependsOn: 'multiSelect' },
    // Signals
    { name: 'expandAll', group: 'Signals', type: 'signal', displayName: 'Expand all rows' },
    { name: 'unExpandAll', group: 'Signals', type: 'signal', displayName: 'Unexpand all rows' },
    { name: 'singleSelected', group: 'Signals', type: 'signal', displayName: 'Single selected' },
    { name: 'initBackend', group: 'Signals', type: 'signal', displayName: 'Initialize backend' },
    { name: 'jwtValidationFailed', group: 'Signals', type: 'signal', displayName: 'JWT validation failed' },
    { name: 'jwtValidationSucceed', group: 'Signals', type: 'signal', displayName: 'JWT validation succeed' },
    { name: 'actionName', group: 'Signals', type: 'string', displayName: 'Action name' },
    // Margins
    { name: 'margins', group: 'Margins', type: 'boolean', displayName: 'Margins' },
    { name: 'm', group: 'Margins', type: { name: 'enum', enums: enums.sizes }, displayName: 'Margin', dependsOn: 'margins' },
    { name: 'mx', group: 'Margins', type: { name: 'enum', enums: enums.sizes }, displayName: 'Margin x-axis', dependsOn: 'margins' },
    { name: 'my', group: 'Margins', type: { name: 'enum', enums: enums.sizes }, displayName: 'Margin y-axis', dependsOn: 'margins' },
    { name: 'mt', group: 'Margins', type: { name: 'enum', enums: enums.sizes }, displayName: 'Margin top', dependsOn: 'margins' },
    { name: 'mr', group: 'Margins', type: { name: 'enum', enums: enums.sizes }, displayName: 'Margin right', dependsOn: 'margins' },
    { name: 'mb', group: 'Margins', type: { name: 'enum', enums: enums.sizes }, displayName: 'Margin bottom', dependsOn: 'margins' },
    { name: 'ml', group: 'Margins', type: { name: 'enum', enums: enums.sizes }, displayName: 'Margin left', dependsOn: 'margins' },
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
    // Layout
    { name: 'tableDensity', group: 'Table layout', type: { name: 'enum', enums: enums.tableDensities }, displayName: 'Density', default: 'xs' },
    { name: 'labelPosition', group: 'Layout', type: { name: 'enum', enums: enums.labelPositions }, displayName: 'Label position', default: 'right' },
    // Dimensions        
    { name: 'loaderSize', group: 'Dimensions', type: { name: 'enum', enums: enums.sizes }, displayName: 'Loader size', default: 'lg' },
    { name: 'size', group: 'Dimensions', type: { name: 'enum', enums: enums.sizes }, displayName: 'Size', default: 'sm' },
] as const satisfies readonly NodePort[];

type PortsNames = typeof ports[number]['name']

export const groupedPorts = {
    'Table params': ['columns', 'grouped', 'selectable', 'singleSelect', 'multiSelect', 'allSelect'],
    'Table layout': ['tableDensity'],
    'Table style': ['loaderSize', 'loaderColor', 'withBorder', 'shadow', 'withColumnBorders', 'radius'],
    'Rows style': ['highlightOnHover', 'onHoverColor', 'backgroundColor', 'highlightSelected', 'selectedColor', 'multiSelectCheckboxColor']
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
        return i
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
