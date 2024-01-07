import helpers from "../helpers";
import { enums } from "../enums";

const params = [
    { name: 'sessionTimeout', group: 'Connection', type: 'string', displayName: 'Session timeout', default: '5d' },
    { name: 'label', group: 'Params', type: 'string', displayName: 'Label' },
    { name: 'description', group: 'Params', type: 'string', displayName: 'Description' },
    { name: 'buttonType', group: 'Params', type: { name: 'enum', enums: enums.buttonTypes }, displayName: 'Button type', tooltip: '"Submit" to trigger form' },
    { name: 'placeholder', group: 'Params', type: 'string', displayName: 'Placeholder' },
    { name: 'debounced', group: 'Params', type: 'boolean', displayName: 'Debounced', default: false, tooltip: 'Delay typed value' },
    { name: 'delay', group: 'Params', type: 'number', displayName: 'Delay (ms)', default: 350, dependsOn: [{ name: 'debounced', value: true }] },
    { name: 'modalHeaderEnabled', group: 'Params', type: 'boolean', displayName: 'Header', default: false },
    { name: 'modalTitle', group: 'Params', type: 'string', displayName: 'Modal title', dependsOn: [{ name: 'modalHeaderEnabled', value: true }] },
    { name: 'closeActionEnabled', group: 'Params', type: 'boolean', displayName: 'Enable close action', default: false, dependsOn: [{ name: 'modalHeaderEnabled', value: true }] },
    { name: 'drawerHeaderEnabled', group: 'Params', type: 'boolean', displayName: 'Header', default: false },
    { name: 'drawerTitle', group: 'Params', type: 'string', displayName: 'Drawer title', dependsOn: [{ name: 'drawerHeaderEnabled', value: true }] },
    { name: 'debouncedTyping', group: 'Params', type: 'boolean', displayName: 'Debounced', default: false, tooltip: 'Delay typed value' },
    { name: 'typingDelay', group: 'Params', type: 'number', displayName: 'Delay (ms)', default: 350, dependsOn: [{ name: 'debouncedTyping', value: true }] },
    { name: 'xlsxColumns', group: 'Params', type: 'array', displayName: 'Columns', default: helpers['xlsxColumns'] },
    { name: 'fileName', group: 'Params', type: 'string', displayName: 'File name', default: 'file.xlsx' },
    { name: 'fileName2', group: 'Params', type: 'string', displayName: 'File name' },
    { name: 'sheetName', group: 'Params', type: 'string', displayName: 'Sheet name' },
    { name: 'xlsxCompression', group: 'Params', type: 'boolean', displayName: 'Compression', default: true },
    { name: 'connectKuzzle', group: 'Params', type: 'boolean', displayName: 'Connect Kuzzle', default: true },
    { name: 'userRole', group: 'Params', type: 'string', displayName: 'User role' },
    { name: 'trapFocus', group: 'Params', type: 'boolean', displayName: 'Trap focus', default: true },
    { name: 'returnFocus', group: 'Params', type: 'boolean', displayName: 'Return focus', default: true },
    { name: 'closeOnEscape', group: 'Params', type: 'boolean', displayName: 'Close on escape', default: false },
    { name: 'closeOnClickOutside', group: 'Params', type: 'boolean', displayName: 'Close on click outside', default: false },
    { name: 'searchable', group: 'Params', type: 'boolean', displayName: 'Searchable', default: true },
    { name: 'clearable', group: 'Params', type: 'boolean', displayName: 'Clearable', default: true },
    { name: 'creatable', group: 'Params', type: 'boolean', displayName: 'Creatable', default: false },
    { name: 'labelField', group: 'Params', type: 'string', displayName: 'Label field', default: 'label' },
    { name: 'dateFormat', group: 'Params', type: 'string', displayName: 'Date format', default: 'projectDefault' },
    { name: 'limitMinDate', group: 'Params', type: 'boolean', displayName: 'Limit min date', default: false },
    { name: 'minDateOffset', group: 'Params', type: 'number', displayName: 'Min date offset', default: 0, dependsOn: [{ name: 'limitMinDate', value: true }] },
    { name: 'textFormat', group: 'Params', type: { name: 'enum', enums: enums.textFormats }, displayName: 'Text format', default: 'none' },
    { name: 'textMask', group: 'Params', type: 'string', displayName: 'Mask', default: '{8} (000) 000-00-00', tooltip: "IMask js lib mask", dependsOn: [{ name: 'textFormat', value: 'mask' }] },
    { name: 'numberFormat', group: 'Params', type: 'array', displayName: 'Number format', isObject: true, tooltip: "Numbro lib format [{ thousandSeparated: true }]", dependsOn: [{ name: 'textFormat', value: 'number' }] },
    { name: 'dateFormatAtText', group: 'Params', type: 'string', displayName: 'Date format', tooltip: "Dayjs format string", default: 'YYYY-MM-DD', dependsOn: [{ name: 'textFormat', value: 'date' }] },
    { name: 'dateFormatAtDatePicker', group: 'Params', type: 'string', displayName: 'Date format', default: 'YYYY-MM-DD' },
    { name: 'dateFormatAtDateTimePicker', group: 'Params', type: 'string', displayName: 'Date format', default: 'YYYY-MM-DD HH:mm' },
    { name: 'datePickerType', group: 'Params', type: { name: 'enum', enums: enums.datePickerTypes }, displayName: 'Type', default: 'default' },
    { name: 'plotFunc', group: 'Params', type: '*', displayName: 'Plot' },
    { name: 'popoverTarget', group: 'Params', type: { name: 'enum', enums: enums.popoverTargets }, displayName: 'Target', default: 'actionIcon' },
    { name: 'popoverButtonLabel', group: 'Params', type: 'string', displayName: 'Button label', dependsOn: [{ name: 'popoverTarget', value: 'button' }] },
    { name: 'qrCodeLevel', group: 'Params', type: { name: 'enum', enums: enums.qrCodeLevels }, displayName: 'QR code level', default: 'L' },
    { name: 'qrCodeLevel2', group: 'Params', type: { name: 'enum', enums: enums.qrCodeLevels }, displayName: 'QR code level', default: 'M' },
    { name: 'gridColumnsScheme', group: 'Params', type: 'array', displayName: 'Columns scheme' },
    { name: 'screenshotEnabled', group: 'Params', type: 'boolean', displayName: 'Enable screenshot', default: false },
    { name: 'maxScansPerSecond', group: 'Params', type: 'number', displayName: 'Enable screenshot', default: 25 },
    { name: 'title', group: 'Params', type: 'string', displayName: 'Title' },
    { name: 'message', group: 'Params', type: 'string', displayName: 'Message' },
    { name: 'autoClose', group: 'Params', type: 'boolean', displayName: 'Auto close', default: true },
    { name: 'autoCloseTimeout', group: 'Params', type: 'number', displayName: 'Auto close timeout (ms)', default: 2000, dependsOn: [{ name: 'autoClose', value: true }] },
    { name: 'uploadFolder', group: 'Params', type: 'string', displayName: 'Folder' },
    { name: 'dataFormat', group: 'Params', type: { name: 'enum', enums: enums.dataFormats }, displayName: 'Data format', default: 'file' },
    { name: 'flowEndpoint', group: 'Params', type: 'string', displayName: 'Flow endpoint' },
    { name: 'dropZoneTitle', group: 'Params', type: 'string', displayName: 'Title', tooltip: 'Title for window in DropZone', default: "Внесите файл или нажмите, чтобы открыть в папке." },
    { name: 'acceptedType', group: 'Params', type: 'string', displayName: 'Type of accepted file', tooltip: 'Type of appected file (*: all, pdf: .pdf, excel: .xls, .xlsx, .ods, image: all images)', default: '*' },
    { name: 'acceptIconName', group: 'Params', type: 'string', displayName: 'Accept icon name', tooltip: 'Find icon at tabler-icons.io and capitalize it: "IconSuperName"', default: 'IconDownload' },
    { name: 'rejectIconName', group: 'Params', type: 'string', displayName: 'Reject icon name', tooltip: 'Find icon at tabler-icons.io and capitalize it: "IconSuperName"', default: 'IconX' },
    { name: 'idleIconName', group: 'Params', type: 'string', displayName: 'Neutral icon name', tooltip: 'Find icon at tabler-icons.io and capitalize it: "IconSuperName"', default: 'IconFolder' },
    { name: 'hideControls', group: 'Params', type: 'boolean', displayName: 'Hide controls', default: false },
    { name: 'min', group: 'Params', type: 'number', displayName: 'Min' },
    { name: 'max', group: 'Params', type: 'number', displayName: 'Max' },
    { name: 'step', group: 'Params', type: 'number', displayName: 'Step', default: 1 },
    { name: 'childIsRepeater', group: 'Params', type: 'boolean', displayName: 'Child is repeater', default: false },
    { name: 'ganttViewMode', group: 'Params', type: { name: 'enum', enums: enums.ganttViewModes }, displayName: 'View mode', default: 'Day' },
    { name: 'showTaskList', group: 'Params', type: 'boolean', displayName: 'Show task list', default: false },
    { name: 'scrollToMultiplier', group: 'Params', type: 'number', displayName: 'Scroll to multiplier', default: 1 },
    { name: 'scrollBehavior', group: 'Params', type: { name: 'enum', enums: enums.scrollBehaviors }, displayName: 'Scroll behavior', default: 'smooth' },
    { name: 'pdfTextContent', group: 'Params', type: 'string', displayName: 'Text content' },
    { name: 'pdfImageSource', group: 'Params', type: 'string', displayName: 'Image source' },
    { name: 'listScheme', group: 'Params', type: 'array', displayName: 'Scheme' },
    { name: 'listType', group: 'Params', type: { name: 'enum', enums: enums.listTypes }, displayName: 'Type', default: 'unordered' },
    { name: 'currentPage', group: 'Params', type: 'number', displayName: 'Current page', default: 1 },
    { name: 'totalPages', group: 'Params', type: 'number', displayName: 'Total pages' },
] as const satisfies readonly NodePort[];

export default params