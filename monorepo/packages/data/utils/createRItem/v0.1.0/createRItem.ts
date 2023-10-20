import getSysProps from "../../getSysProps/v0.1.0/getSysProps"

export default function (rItem: RItem, props: ItemSysProps) {
    const defindedProps = getSysProps(props)
    const nItem = window.Noodl.Object.create(rItem)
    if (!nItem.dbClass) Object.defineProperties(nItem, defindedProps)
    return nItem
}