import setItemSysProps from "../../../utils/setItemSysProps/v0.1.0/setItemSysProps"
import { setItemRefs, setRefsFromItem } from "../../setRefs/v0.6.0/setRefs"

export default function (
    dbClass: string, storeKey?: string, kItems?: KItem[], references?: string, backReferences?: string
): RItem[] | undefined {
    const { set } = window.R.libs.just

    const refs: string[] = references ? JSON.parse(references) : []
    const backRefs: string[] = backReferences ? JSON.parse(backReferences) : []
    const rItems = kItems?.map(kItem => ({ id: kItem._id, ...kItem._source })) as RItem[]
    
    return rItems?.map(rItem => {
        rItem = setItemSysProps(rItem, { dbClass, storeKey: storeKey || '', refs, backRefs })
        rItem = setItemRefs(rItem)
        const proxyItem = new Proxy(rItem, {})
        setRefsFromItem(proxyItem)
        set(window.R.items, rItem.id, proxyItem)
        return rItem
    })
}