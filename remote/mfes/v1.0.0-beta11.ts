import pJson from '../../package.json'
const rkVersion = pJson.version.replaceAll('.', '_').replaceAll('-', '_')

export default {
  name: 'remote',
  exposes: {
    // ui =================================================    
    // Mantine    
    './ui/mantine/mantine-v1.0.0': '../shared/components/ui/mantine/v1.0.0/mantine.tsx',
    //// elements
    ////// dataDisplay
    './ui/mantine/elements/dataDisplay/image-v1.0.0': '../shared/components/ui/mantine/elements/dataDisplay/image/v1.0.0/image.tsx',
    './ui/mantine/elements/dataDisplay/badge-v1.0.0': '../shared/components/ui/mantine/elements/dataDisplay/badge/v1.0.0/badge.tsx',
    './ui/mantine/elements/dataDisplay/icon-v1.0.0': '../shared/components/ui/mantine/elements/dataDisplay/icon/v1.0.0/icon.tsx',
    ////// buttons
    './ui/mantine/elements/buttons/action-icon-v1.0.0': '../shared/components/ui/mantine/elements/buttons/actionIcon/v1.0.0/actionIcon.tsx',
    './ui/mantine/elements/buttons/button-v1.0.0': '../shared/components/ui/mantine/elements/buttons/button/v1.0.0/button.tsx',
    ////// inputs
    './ui/mantine/elements/inputs/password-input-v1.0.0': '../shared/components/ui/mantine/elements/inputs/passwordInput/v1.0.0/passwordInput.tsx',
    './ui/mantine/elements/inputs/text-input-v1.0.0': '../shared/components/ui/mantine/elements/inputs/textInput/v1.0.0/textInput.tsx',
    './ui/mantine/elements/inputs/number-input-v1.0.0': '../shared/components/ui/mantine/elements/inputs/numberInput/v1.0.0/numberInput.tsx',
    './ui/mantine/elements/inputs/masked-input-v1.0.0': '../shared/components/ui/mantine/elements/inputs/maskedInput/v1.0.0/maskedInput.tsx',
    './ui/mantine/elements/inputs/select-v1.0.0': '../shared/components/ui/mantine/elements/inputs/select/v1.0.0/select.tsx',
    './ui/mantine/elements/inputs/textarea-v1.0.0': '../shared/components/ui/mantine/elements/inputs/textarea/v1.0.0/textarea.tsx',
    './ui/mantine/elements/inputs/date-time-picker-v1.0.0': '../shared/components/ui/mantine/elements/inputs/dateTimePicker/v1.0.0/dateTimePicker.tsx',
    './ui/mantine/elements/inputs/segmented-control-v1.0.0': '../shared/components/ui/mantine/elements/inputs/segmentedControl/v1.0.0/segmentedControl.tsx',
    './ui/mantine/elements/inputs/checkbox-group-v1.0.0': '../shared/components/ui/mantine/elements/inputs/checkboxGroup/v1.0.0/checkboxGroup.tsx',
    './ui/mantine/elements/inputs/checkbox-v1.0.0': '../shared/components/ui/mantine/elements/inputs/checkbox/v1.0.0/checkbox.tsx',
    './ui/mantine/elements/inputs/multi-select-v1.0.0': '../shared/components/ui/mantine/elements/inputs/multiSelect/v1.0.0/multiSelect.tsx',
    './ui/mantine/elements/inputs/date-picker-input-v1.0.0': '../shared/components/ui/mantine/elements/inputs/datePickerInput/v1.0.0/datePickerInput.tsx',
    ////// typography
    './ui/mantine/elements/typography/text-v1.0.0': '../shared/components/ui/mantine/elements/typography/text/v1.0.0/text.tsx',
    './ui/mantine/elements/typography/title-v1.0.0': '../shared/components/ui/mantine/elements/typography/title/v1.0.0/title.tsx',
    './ui/mantine/elements/typography/highlight-v1.0.0': '../shared/components/ui/mantine/elements/typography/highlight/v1.0.0/highlight.tsx',
    './ui/mantine/elements/typography/list-v1.0.0': '../shared/components/ui/mantine/elements/typography/list/v1.0.0/list.tsx',
    ///// navigation
    './ui/mantine/elements/navigation/nav-link-v1.0.0': '../shared/components/ui/mantine/elements/navigation/navLink/v1.0.0/navLink.tsx',
    //// molecules    
    './ui/mantine/molecules/form-v1.0.0': '../shared/components/ui/mantine/molecules/form/v1.0.0/form.tsx',
    './ui/mantine/molecules/group-v1.0.0': '../shared/components/ui/mantine/molecules/group/v1.0.0/group.tsx',
    './ui/mantine/molecules/stack-v1.0.0': '../shared/components/ui/mantine/molecules/stack/v1.0.0/stack.tsx',
    './ui/mantine/molecules/box-v1.0.0': '../shared/components/ui/mantine/molecules/box/v1.0.0/box.tsx',
    './ui/mantine/molecules/flex-v1.0.0': '../shared/components/ui/mantine/molecules/flex/v1.0.0/flex.tsx',
    './ui/mantine/molecules/center-v1.0.0': '../shared/components/ui/mantine/molecules/center/v1.0.0/center.tsx',
    './ui/mantine/molecules/paper-v1.0.0': '../shared/components/ui/mantine/molecules/paper/v1.0.0/paper.tsx',
    ////// hoverCard
    './ui/mantine/molecules/hover-card-v1.0.0': '../shared/components/ui/mantine/molecules/hoverCard/v1.0.0/hoverCard.tsx',
    './ui/mantine/molecules/hover-card-target-v1.0.0': '../shared/components/ui/mantine/molecules/hoverCard/modules/hoverCardTarget/v1.0.0/hoverCardTarget.tsx',
    './ui/mantine/molecules/hover-card-dropdown-v1.0.0': '../shared/components/ui/mantine/molecules/hoverCard/modules/hoverCardDropdown/v1.0.0/hoverCardDropdown.tsx',
    ////// popover
    './ui/mantine/molecules/popover-v1.0.0': '../shared/components/ui/mantine/molecules/popover/v1.0.0/popover.tsx',
    './ui/mantine/molecules/popover-target-v1.0.0': '../shared/components/ui/mantine/molecules/popover/modules/popoverTarget/v1.0.0/popoverTarget.tsx',
    './ui/mantine/molecules/popover-dropdown-v1.0.0': '../shared/components/ui/mantine/molecules/popover/modules/popoverDropdown/v1.0.0/popoverDropdown.tsx',
    //// organisms
    ////// table
    './ui/mantine/organisms/table-v1.0.0': '../shared/components/ui/mantine/organisms/table/v1.0.0/table.tsx',
    './ui/mantine/organisms/table/column-cell-v1.0.0': '../shared/components/ui/mantine/organisms/table/modules/columnCell/v1.0.0/columnCell.tsx',
    './ui/mantine/organisms/table/expansion-row-v1.0.0': '../shared/components/ui/mantine/organisms/table/modules/expansionRow/v1.0.0/expansionRow.tsx',
    './ui/mantine/organisms/table/column-filter-v1.0.0': '../shared/components/ui/mantine/organisms/table/modules/columnFilter/v1.0.0/columnFilter.tsx',
    // WebCamera
    //'./ui/web-camera-v1.0.0': '../shared/components/ui/webCamera/v1.0.0/webCamera.tsx',
    // pdf
    './ui/pdf/pdf-viewer-v1.0.0': '../shared/components/ui/pdf/pdfViewer/v1.0.0/pdfViewer.tsx',    
    // qrCode
    './ui/qr-code/get-qr-code-v1.0.0': '../shared/components/ui/qrCode/getQrCode/v1.0.0/getQrCode.ts',
    './ui/qr-code/qr-code-v1.0.0': '../shared/components/ui/qrCode/qrCode/v1.0.0/qrCode.tsx',
    './ui/qr-code/qr-scanner-v1.0.0': '../shared/components/ui/qrCode/qrScanner/v1.0.0/qrScanner.tsx',
    // data ===============================================
    './data/data-v1.0.0': '../shared/components/data/data/v1.0.0/data.tsx',
    './data/auth-v1.0.0': '../shared/components/data/auth/v1.0.0/auth.tsx',
    './data/logout-v1.0.0': '../shared/components/data/logout/v1.0.0/logout.ts',
    './data/data-context-v0.1.0': '../shared/components/data/dataContext/v0.1.0/dataContext.tsx',
    './data/data-context-v0.1.1': '../shared/components/data/dataContext/v0.1.1/dataContext.tsx',
    './data/use-data-v0.11.0': '../shared/components/data/useData/v0.11.0/useData.tsx',
    './data/use-data-v0.12.3': '../shared/components/data/useData/v0.12.3/useData.tsx',
    './data/use-data-v0.12.4': '../shared/components/data/useData/v0.12.4/useData.tsx',
    './data/use-data-v1.0.0': '../shared/components/data/useData/v1.0.0/useData.tsx',
    './data/get-data-v1.0.0': '../shared/components/data/getData/v1.0.0/getData.ts',
    './data/nodered-v1.0.0': '../shared/components/data/nodered/v1.0.0/nodered.ts',
    './data/save-as-v1.0.0': '../shared/components/data/saveAs/v1.0.0/saveAs.ts',
    // xlsx ===============================================
    './xlsx/create-xlsx-v1.0.0': '../shared/components/xlsx/createXlsx/v1.0.0/createXlsx.ts',
  },
  filename: `${rkVersion}/remoteEntry.js`,
}
