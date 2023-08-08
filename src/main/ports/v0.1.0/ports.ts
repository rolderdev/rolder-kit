import { enums } from "./enums"

const units = ['rem', '%', 'px']
// types
const string = { type: 'string' }
const number = { type: 'number' }
const boolean = { type: 'boolean' }
const array = { type: 'array' }
const object = { type: 'object' }
const signal = { type: 'signal' }
// groups
const General = { group: 'General' }
const Data = { group: 'Data' }
const Params = { group: 'Params' }
const States = { group: 'States' }
const Signals = { group: 'Signals' }
const Style = { group: 'Style' }
const Layout = { group: 'Layout' }
const Margins = { group: 'Margins' }
const Paddings = { group: 'Paddings' }
const Dimensions = { group: 'Dimensions' }
const ControlledDimensions = { group: 'ControlledDimensions' }
const Icon = { group: 'Icon' }
const Font = { group: 'Font' }
const Form = { group: 'Form' }
const Sx = { group: 'Sx' }

const reactPorts = {
    General: {

    },
    Data: {
        dbClass: { ...Data, ...string, displayName: 'Database class', },
        dbClasses: { ...Data, ...array, displayName: 'Database classes', },
        itemId: { ...Data, ...string, displayName: 'Item id' },
        itemsIds: { ...Data, ...array, displayName: 'Items ids', tooltip: "Example: ['id1', 'id2']" },
        tableData: { ...Data, ...object, displayName: 'Table data' },
        foundedData: { ...Data, ...object, displayName: 'Founded data' },
        selectedItem: { ...Data, ...object, displayName: 'Selected item' },
        selectedItems: { ...Data, ...array, displayName: 'Selected items' },
        selectedPath: { ...Data, ...string, displayName: 'Selected path' },
        value: { ...Data, ...string, displayName: 'Value' },
        searchString: { ...Data, ...string, displayName: 'Search string' },
        inputItems: { ...Data, ...array, displayName: 'Input items' },
        items: { ...Data, ...array, displayName: 'Items' },
        customItems: { ...Data, ...array, displayName: 'Custom items', tooltip: "Example: [{ value: 'option-1', label: 'Option 1' }]" },
        selectedValue: { ...Data, ...string, displayName: 'Selected value' },
        title: { ...Data, ...string, displayName: 'Title' },
        label: { ...Data, ...string, displayName: 'Label' },
        sourceUrl: { ...Data, ...string, displayName: 'Source url' },
        placeholder: { ...Data, ...string, displayName: 'Placeholder' },
        createValue: { ...Data, ...string, displayName: 'Create value' },
        inputString: { ...Data, ...string, displayName: 'Input string' },
        screenshot: { ...Data, ...string, displayName: 'Screenshot' },
        message: { ...Data, ...string, displayName: 'Message' },
        uploadItems: { ...Data, ...array, displayName: 'Upload items', tooltip: "Example: [{name: ..., contentType: 'image/jpeg', data: base64}]" },
        uploadFolder: { ...Data, ...string, displayName: 'Upload folder' },
        uploadedUrls: { ...Data, ...array, displayName: 'Uploaded urls' },
        selectedDate: { ...Data, ...array, displayName: 'Selected date' },
        selectedDates: { ...Data, ...array, displayName: 'Selected dates' },        
    },
    Params: {
        useDataType: { ...General, type: { name: 'enum', enums: enums.useDataTypes }, displayName: 'Query type' },
        notificationsPosition: { ...Params, type: { name: 'enum', enums: enums.notificationsPositions }, displayName: 'Notifications position', default: 'bottom-right' },
        query: { ...Params, ...array, displayName: 'Query', tooltip: "Example: [{ content.name: { 'ta-da!!!'} }]" },
        sorts: { ...Params, ...array, displayName: 'Sorts', tooltip: "Example: [{ content.name: 'asc' }]" },
        options: { ...Params, ...array, displayName: 'Options', tooltip: "Example: [{ size: 100 }]" },
        columns: { ...Params, ...array, displayName: 'Columns' },
        noHeader: { ...Params, ...boolean, displayName: 'No header' },
        selectable: { ...Params, ...boolean, displayName: 'Selectable' },
        singleRowSelectable: { ...Params, ...boolean, displayName: 'Single row selectable' },
        multipleRowSelectable: { ...Params, ...boolean, displayName: 'Multiple row selectable' },
        selectableType: { ...Params, type: { name: 'enum', enums: enums.selectableTypes }, displayName: 'Type', default: 'singleRow' },
        highlightOnHover: { ...Params, ...boolean, displayName: 'Hightlight row on hover' },
        highlightSelectedRow: { ...Params, ...boolean, displayName: 'Hightlight selected row' },
        selectFirstItem: { ...Params, ...boolean, displayName: 'Select first item' },
        enableHeader: { ...Params, ...boolean, displayName: 'Header' },
        enableFooter: { ...Params, ...boolean, displayName: 'Footer' },
        enableNavbar: { ...Params, ...boolean, displayName: 'Navbar' },
        navItems: { ...Params, ...array, displayName: 'Navigation items' },
        searchFields: { ...Params, ...array, displayName: 'Search fields', tooltip: "Example: ['content.name.search']" },
        tableScheme: { ...Params, ...array, displayName: 'Table scheme' },
        filterMaps: { ...Params, ...array, displayName: 'Filter maps' },
        offsetScrollbars: { ...Params, ...boolean, displayName: 'Offset scrollbars' },
        withCloseButton: { ...Params, ...boolean, displayName: 'With close button', default: false, tooltip: "Hides close button and title" },
        formScheme: { ...Params, ...array, displayName: 'Form scheme', tooltip: "Example: [{name: 'startDate', initialValue: new Date(), validate: isNotEmpty}]" },
        buttonType: { ...Params, type: { name: 'enum', enums: enums.buttonTypes }, displayName: 'Button type', tooltip: '"Submit" to trigger form' },
        qrCodeLevel: { ...Params, type: { name: 'enum', enums: enums.qrCodeLevels }, displayName: 'QR code level', default: 'L' },
        withAsterisk: { ...Params, ...boolean, displayName: 'With asterisk' },
        dateFormat: { ...Params, ...string, displayName: 'Date format', default: 'YYYY-MM-DD HH:mm' },
        limitMinDate: { ...Params, ...boolean, displayName: 'Limit minimal date', default: false },
        daysOffset: { ...Params, ...number, displayName: 'Minimum days offset', default: 0, tooltip: 'Number of days to offset. Negative for past offset' },
        labelField: { ...Params, ...string, displayName: 'Label field' },
        searchable: { ...Params, ...boolean, displayName: 'Searchable' },
        clearable: { ...Params, ...boolean, displayName: 'Clearable' },
        creatable: { ...Params, ...boolean, displayName: 'Creatable' },
        debounced: { ...Params, ...boolean, displayName: 'Debounced', default: false, tooltip: 'Delay typed string at output' },
        delay: { ...Params, ...number, displayName: 'Delay (ms)', default: 350 },
        autoClose: { ...Params, ...number, displayName: 'Autoclose (ms)' },
        useCustomItems: { ...Params, ...boolean, displayName: 'Use custom items', default: false },
        withArrow: { ...Params, ...boolean, displayName: 'With arrow' },
        datePickerType: { ...Params, type: { name: 'enum', enums: enums.datePickerTypes }, displayName: 'Type', default: 'default' },
        inline: { ...Params, ...boolean, displayName: 'Inline' },
    },
    States: {
        enabled: { ...States, ...boolean, displayName: 'Enabled' },
        disabled: { ...States, ...boolean, displayName: 'Disabled' },
        loading: { ...States, ...boolean, displayName: 'Loading' },
        searchEnabled: { ...States, ...boolean, displayName: 'Search enabled' },
        uploading: { ...States, ...boolean, displayName: 'Uploading' },
        processing: { ...States, ...boolean, displayName: 'Processing' },
    },
    Signals: {
        inited: { ...Signals, ...signal, displayName: 'Inited' },
        loaded: { ...Signals, ...signal, displayName: 'Loaded' },
        selected: { ...Signals, ...signal, displayName: 'Selected' },
        resetSelected: { ...Signals, ...boolean, displayName: 'Reset selected' },
        resetSingleSelected: { ...Signals, ...boolean, displayName: 'Reset single selected' },
        resetMultipleSelected: { ...Signals, ...boolean, displayName: 'Reset multiple selected' },
        doDelete: { ...Signals, ...signal, displayName: 'Delete' },
        pathChanged: { ...Signals, ...signal, displayName: 'Path changed' },
        authenticated: { ...Signals, ...signal, displayName: 'Authenticated' },
        viewItem: { ...Signals, ...signal, displayName: 'View item clicked' },
        editItem: { ...Signals, ...signal, displayName: 'Edit item clicked' },
        viewImages: { ...Signals, ...signal, displayName: 'View images' },
        clicked: { ...Signals, ...signal, displayName: 'Clicked' },
        show: { ...Signals, ...boolean, displayName: 'Show' },
        hided: { ...Signals, ...signal, displayName: 'Hided' },
        hide: { ...Signals, ...boolean, displayName: 'Hide' },
        submited: { ...Signals, ...signal, displayName: 'Submited' },
        create: { ...Signals, ...signal, displayName: 'Create' },
        screenshoted: { ...Signals, ...signal, displayName: 'Screenshot ready' },
        uploaded: { ...Signals, ...signal, displayName: 'Uploaded' },
        jwtValidationFailed: { ...Signals, ...signal, displayName: 'JWT validation failed' },
    },
    Style: {
        detectColorScheme: { ...Style, ...boolean, displayName: 'Autodetect color scheme', },
        colorScheme: { ...Style, type: { name: 'enum', enums: enums.colorSchemes }, displayName: 'Default color scheme' },
        shadow: { ...Style, type: { name: 'enum', enums: enums.sizes }, displayName: 'Shadow' },
        borderRadius: { ...Style, type: { name: 'enum', enums: enums.sizes }, displayName: 'Border radius' },
        withBorder: { ...Style, ...boolean, displayName: 'With border' },
        withColumnBorders: { ...Style, ...boolean, displayName: 'Column borders' },
        color: { ...Style, type: { name: 'enum', enums: enums.colors }, displayName: 'Color' },
        buttonColor: { ...Style, type: { name: 'enum', enums: enums.colors }, displayName: 'Button color' },
        opacity: { ...Style, ...number, displayName: 'Opacity' },
        radius: { ...Style, type: { name: 'enum', enums: enums.sizes }, displayName: 'Radius' },
        actionVariant: { ...Style, type: { name: 'enum', enums: enums.actionVariants }, displayName: 'Variant' },
        striped: { ...Style, ...boolean, displayName: 'Striped' },
        loaderVariant: { ...Style, type: { name: 'enum', enums: enums.loaderVariants }, displayName: 'Variant' },
        avatarVariant: { ...Style, type: { name: 'enum', enums: enums.avatarVariants }, displayName: 'Variant' },
        badgeVariant: { ...Style, type: { name: 'enum', enums: enums.badgeVariants }, displayName: 'Variant', default: 'light' },
    },
    Margins: {
        m: { ...Margins, type: { name: 'enum', enums: enums.sizes }, displayName: 'Margin' },
        mt: { ...Margins, type: { name: 'enum', enums: enums.sizes }, displayName: 'Margin top' },
        mr: { ...Margins, type: { name: 'enum', enums: enums.sizes }, displayName: 'Margin right' },
        mb: { ...Margins, type: { name: 'enum', enums: enums.sizes }, displayName: 'Margin bottom' },
        ml: { ...Margins, type: { name: 'enum', enums: enums.sizes }, displayName: 'Margin left' },
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
        grow: { ...Layout, ...boolean, displayName: 'Grow' },
        orientation: { ...Layout, ...boolean, displayName: 'Vertical', default: false },
        bottomOffset: { ...Layout, ...number, displayName: 'Bottom offset', default: 0 },
        drawerPosition: { ...Layout, type: { name: 'enum', enums: enums.drawerPositions }, displayName: 'Position' },
        gutter: { ...Layout, type: { name: 'enum', enums: enums.sizes }, displayName: 'Gutter' },
        spans: { ...Layout, ...array, displayName: 'Spans', tooltip: "Example: [4,4,4] One row = 12. Can be number, auto, content" },
        direction: { ...Layout, type: { name: 'enum', enums: enums.directions }, displayName: 'Direction', },
        dropdownType: { ...Layout, type: { name: 'enum', enums: enums.dropdownTypes }, displayName: 'Dropdown type', default: 'popover' },
    },
    Dimensions: {
        w: { ...Dimensions, type: { name: 'number', units, defaultUnit: 'rem' }, displayName: 'Width' },
        maw: { ...Dimensions, type: { name: 'number', units, defaultUnit: 'rem' }, displayName: 'Max width' },
        h: { ...Dimensions, type: { name: 'number', units, defaultUnit: 'rem' }, displayName: 'Height' },
        size: { ...Dimensions, type: { name: 'enum', enums: enums.sizes }, displayName: 'Size' },
        sizeUnits: { ...Dimensions, type: { name: 'number', units, defaultUnit: 'rem' }, displayName: 'Size' },
        sizeString: { ...Dimensions, ...string, displayName: 'Size string' },
        sizeNumber: { ...Dimensions, ...number, displayName: 'Size number' },
    },
    Icon: {
        iconName: { ...Icon, ...string, displayName: 'Icon name', tooltip: 'Find icon at tabler-icons.io and capitalize it: "IconSuperName"' },
        iconSize: { ...Icon, type: { name: 'number', units, defaultUnit: 'rem' }, displayName: 'Icon size' },
        stroke: { ...Icon, ...number, displayName: 'Stroke' },
    },
    ControlledDimensions: {
        widthString: { ...ControlledDimensions, ...string, displayName: 'Width (string)' },
        heightString: { ...ControlledDimensions, ...string, displayName: 'Height (string)' },
    },
    Font: {
        fz: { ...Font, type: { name: 'enum', enums: enums.sizes }, displayName: 'Size' },
        fw: { ...Font, type: { name: 'enum', enums: enums.fontWeights }, displayName: 'Weight' },
    },
    Form: {
        useForm: { ...Form, ...boolean, displayName: 'Use form' },
        formField: { ...Form, ...string, displayName: 'Form field' },
        formHook: { ...Form, ...object, displayName: 'Form hook' },
    },
    Sx: {
        minHeight: { ...Sx, type: { name: 'number', units, defaultUnit: 'rem' }, displayName: 'Min height' },
        fontSize: { ...Sx, type: { name: 'enum', enums: enums.sizes }, displayName: 'Font size' },
        customSx: { ...Sx, ...array, displayName: 'Custom sx', tooltip: "Example: [{ width: 100 }]" },
        backgroundColor: { ...Sx, type: { name: 'enum', enums: enums.colors }, displayName: 'Background color' },
        colorShade: { ...Sx, type: { name: 'enum', enums: enums.colorShades }, displayName: 'Color shade', default: '6' },
    }
}

const jsPorts = {
    Data: {
        createItem: { ...Data, ...object, displayName: 'Create item', tooltip: "Example: {dbClass: 'task', body: {...}}" },
        createdItem: { ...Data, ...object, displayName: 'Created item' },
        createItems: { ...Data, ...object, displayName: 'Create items', tooltip: "Example: { dbClass: 'task', items: [{body: {...} }] }" },
        createdItems: { ...Data, ...array, displayName: 'Created items' },
        updateItem: { ...Data, ...object, displayName: 'Update item', tooltip: "Example: { dbClass: 'task', id: 'task id', body: {...} }" },
        updatedItem: { ...Data, ...object, displayName: 'Updated item' },
        updateItems: { ...Data, ...object, displayName: 'Update items', tooltip: "Example: { dbClass: 'task', items: [{id: 'id', body: {...} }] }" },
        updatedItems: { ...Data, ...array, displayName: 'Updated items' },
        deleteItems: { ...Data, ...array, displayName: 'Delete items', tooltip: "Example: { dbClass: 'task', itemsIds: ['id1'] }" },
        createUserItem: { ...Data, ...object, displayName: 'Create user item', tooltip: "Example: {body: {content: {...}, credentials: {...}}}" },
        createdUserItem: { ...Data, ...object, displayName: 'Created user item' },
        deleteUserIds: { ...Data, ...array, displayName: 'Delete user ids', tooltip: "Example: ['kuid1', 'kuid2']" },
    },
    States: {
        creating: { ...States, ...boolean, displayName: 'Creating' },
        updating: { ...States, ...boolean, displayName: 'Updating' },
        deleting: { ...States, ...boolean, displayName: 'Deleting' },
    },
    Signals: {
        initBackend: { ...Signals, ...signal, displayName: 'initialize backend' },
        jwtValidationFailed: { ...Signals, ...signal, displayName: 'JWT validation failed' },
        jwtValidationSucceed: { ...Signals, ...signal, displayName: 'JWT validation succeed' },
        created: { ...Signals, ...signal, displayName: 'Created' },
        updated: { ...Signals, ...signal, displayName: 'Updated' },
        deleted: { ...Signals, ...signal, displayName: 'Deleted' },
    }
}

export { reactPorts, jsPorts }