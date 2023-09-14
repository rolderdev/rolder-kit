import convertK from "../../tools/convertK/v0.1.0/convertK"
import setRefs from "../../tools/setRefs/v0.5.0/setRefs"

export default function (dbClass: string, kResponse: KResponse, subscribe: boolean): NDBClass {
    const { Noodl } = window
    const rItems = convertK(kResponse.hits as KItem[])
    const nDBClass = Noodl.Object.create({
        id: dbClass,
        dbClass,
        fetchedCount: kResponse.fetched,
        totalCount: kResponse.total,
        subscribe,
        items: rItems.map(r => Noodl.Object.create(r)),
    } as NDBClass)
    setRefs(dbClass)
    return nDBClass as NDBClass
}

export function createNUserClass(kResponse: KResponse, rUsers: RUser[]): NDBClass {
    const { Noodl } = window
    const nDBClass = Noodl.Object.create({
        id: 'user',
        dbClass: 'user',
        fetchedCount: kResponse.fetched,
        items: rUsers.map(r => Noodl.Object.create(r)),
    } as NDBClass)
    setRefs('user')
    return nDBClass as NDBClass
}