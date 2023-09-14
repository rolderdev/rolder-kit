export default function (dbClass: string) {
    const { Noodl } = window

    const allRawItems: RItem[] = Noodl.Objects[dbClass]?.items?.map((i: NItem) => ({ ...i.data, id: i.id }))
    Noodl.Objects[dbClass].setAll({
        dbClass,
        items: allRawItems?.map((o: any) => Noodl.Object.create(o))
    })
}