export default {
    values: ({ items, field, values }: { items: RItem[], field: string, values: string[], }) => {
        const data: { result: boolean, items?: any[] } = { result: false }
        data.items = items.filter(i => values.includes(window.R.utils.getValue.v7(i, field)))
        if (data.items.length) data.result = true
        return data
    },
    reference: ({ dbClass, refDbClass, reversedRef }: { dbClass: string, refDbClass: string, reversedRef: boolean }) => {
        const Noodl = window.Noodl
        const resultData: { result: boolean, items?: any[] } = { result: false }
        if (reversedRef) resultData.items = Noodl.Objects[dbClass].items
            ?.filter((i: any) => Noodl.Objects[refDbClass].items.map((i: any) => i[dbClass].id).includes(i.id))
        else resultData.items = Noodl.Objects[dbClass].items
            ?.filter((i: any) => Noodl.Objects[refDbClass].items.map((i: any) => i.id).includes(i[refDbClass].id))
        if (resultData.items?.length) resultData.result = true
        return resultData
    },
    dateRange: ({ items, field, dateRange }: { items: any[], field: string, dateRange: [Date, Date] }) => {
        const data: { result: boolean, items?: any[] } = { result: false }
        const startDate = window.R.libs.dayjs(dateRange[0]).startOf('day')
        const endDate = window.R.libs.dayjs(dateRange[1]).endOf('day')
        data.items = items.filter(i => window.R.libs.dayjs(window.R.utils.getValue.v7(i, field)).isBetween(startDate, endDate, 'day', '[]'))
        if (data.items.length) data.result = true
        return data
    }
}