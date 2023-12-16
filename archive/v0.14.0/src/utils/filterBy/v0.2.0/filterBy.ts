import Mustache from "mustache"
import Dayjs from "dayjs"

const filterBy = {
    values: ({ items, field, values }: { items: any[], field: string, values: string[], }) => {
        const data: { r: boolean, i?: any[] } = { r: false }
        data.i = items.filter(i => values.includes(Mustache.render(`{{${field}}}`, i)))
        if (data.i.length) data.r = true
        return data
    },
    reference: ({ dbClass, refDbClass, reversedRef }: { dbClass: string, refDbClass: string, reversedRef: boolean }) => {
        const Noodl = window.Noodl
        const resultData: { r: boolean, i?: any[] } = { r: false }
        if (reversedRef) resultData.i = Noodl.Objects[dbClass].items
            ?.filter((i: any) => Noodl.Objects[refDbClass].items.map((i: any) => i[dbClass].id).includes(i.id))
        else resultData.i = Noodl.Objects[dbClass].items
            ?.filter((i: any) => Noodl.Objects[refDbClass].items.map((i: any) => i.id).includes(i[refDbClass].id))
        if (resultData.i?.length) resultData.r = true
        return resultData
    },
    dateRange: ({ items, field, dateRange }: { items: any[], field: string, dateRange: [Date, Date] }) => {
        const data: { r: boolean, i?: any[] } = { r: false }
        const startDate = Dayjs(dateRange[0]).startOf('day')
        const endDate = Dayjs(dateRange[1]).endOf('day')
        data.i = items.filter(i => Dayjs(Mustache.render(`{{${field}}}`, i)).isBetween(startDate, endDate, 'day', '[]'))
        if (data.i.length) data.r = true
        return data
    }
}

export default filterBy