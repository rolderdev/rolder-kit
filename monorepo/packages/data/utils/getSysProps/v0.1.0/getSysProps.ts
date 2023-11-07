export default function (props: ItemSysProps) {
    const defindedProps: any = {}
    const propNames = ['dbClass', 'noodlNodeId', 'storeKey', 'refs', 'backRefs'] as const
    propNames.forEach(prop => {
        defindedProps[prop] = {
            value: props[prop],
            writable: false,
            enumerable: false,
            configurable: true
        }
    })

    return defindedProps
}