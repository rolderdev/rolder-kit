import sharedProps from "./shared"
const {
    m, mt, mr, mb, ml, h, w, p, pt, pr, pb, pl, fz, fw, backgroundColor, colorShade, jwtValidationFailed, jwtValidationSucceed, useForm, formField, formHook,
    tableScheme, tableData, filterMaps, fontSize, borderRadius, verticalSpacing, withColumnBorders, minHeight, isLoading, columns, shadow, withBorder,
    widthString, noHeader, selectable, selectableType, highlightOnHover, highlightSelectedRow, enableHeader, headerHeight, enableFooter,
    enableNavbar, navItems, heightString, filesData, folder,
} = sharedProps

const groupedProps = {
    sxBgColor: { backgroundColor, colorShade },
    sxDimensions: { width: { ...w }, height: { ...h } },
    margins: { m, mt, mr, mb, ml },
    paddings: { p, pt, pr, pb, pl },
    dimensions: { w, h },
    font: { fz, fw },
    auth: { jwtValidationFailed, jwtValidationSucceed },
    form: { useForm, formField, formHook },
    Table: {
        tableData, isLoading, columns, shadow, fontSize, borderRadius, verticalSpacing, withBorder, withColumnBorders, widthString, minHeight,
        noHeader, selectable, selectableType, highlightOnHover, highlightSelectedRow, heightString,
    },
    ETable: { tableScheme, tableData, filterMaps, fontSize, borderRadius, verticalSpacing, withColumnBorders, minHeight },
    AppShell: { enableHeader, headerHeight, enableFooter, enableNavbar, navItems },
    uploadFiles: { filesData, folder }
}

export default groupedProps