import extend from "just-extend"
import setRefs from "../../tools/setRefs/v0.5.0/setRefs"
import triggerQueries from "../../tools/triggerQueries/v0.1.0/triggerQueries"

export default function (dbClass: string, rItems: RItem[]): NItem[] {
    const { Noodl } = window

    const nItems: NItem[] = rItems.map(i => {
        Noodl.Objects[i.id].setAll(extend(true, Noodl.Objects[i.id].data, i))
        return Noodl.Objects[i.id]
    })

    setRefs(dbClass)
    triggerQueries(dbClass)
    return nItems
}