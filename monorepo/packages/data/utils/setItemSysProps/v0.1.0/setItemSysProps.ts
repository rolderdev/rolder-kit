export default function (rItem: RItem, props?: ItemSysProps) {
    const defindedProps: any = {}
    const propNames = ['dbClass', 'storeKey', 'refs', 'backRefs'] as const
    propNames.forEach(prop => {
        defindedProps[prop] = {
            get() { return props?.[prop] ? props[prop] : rItem[prop] },
            configurable: false
        }
    })
    const newItem = Object.assign({}, rItem)
    Object.defineProperties(newItem, defindedProps)
    return newItem
}