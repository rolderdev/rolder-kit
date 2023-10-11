import { setItemCustomRefs, setItemRefs } from "../../dataStore/v0.1.0/dataStore"

export default function (dbClass: string, kItems?: KItem[], references?: string, customReferences?: string): RItem[] | undefined {
    const { set } = window.R.libs.just

    const refs = references ? JSON.parse(references) : []
    const customRefs = customReferences ? JSON.parse(customReferences) : []
    const rItems = kItems?.map(kItem => ({ id: kItem._id, ...kItem._source }))
    rItems?.forEach(rItem => {
        Object.defineProperty(rItem, 'dbClass', { get() { return dbClass }, configurable: false, })
        Object.defineProperty(rItem, 'refs', { get() { return refs }, configurable: false, })
        Object.defineProperty(rItem, 'customRefs', { get() { return customRefs }, configurable: false, })
        rItem = setItemRefs(rItem)
        rItem = setItemCustomRefs(rItem)
        const proxyItem = new Proxy(rItem, {})
        set(window.R.items, rItem.id, proxyItem)
    })
    return rItems
}