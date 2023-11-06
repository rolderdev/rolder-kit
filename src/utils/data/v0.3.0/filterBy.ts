import Mustache from "mustache"
import Dayjs from "dayjs"

const filterBy = {
    values: (items: any[], values: string[], field: string) => {
        const data: { r: boolean, i?: any[] } = { r: false }
        data.i = items.filter(i => values.includes(Mustache.render(`{{${field}}}`, i)))
        if (data.i.length) data.r = true
        return data
    },
    dateRange: (items: any[], dateRange: [Date, Date], field: string) => {
        const data: { r: boolean, i?: any[] } = { r: false }
        const startDate = Dayjs(dateRange[0]).startOf('day')
        const endDate = Dayjs(dateRange[1]).endOf('day')
        data.i = items.filter(i => Dayjs(Mustache.render(`{{${field}}}`, i)).isBetween(startDate, endDate, 'day', '[]'))
        if (data.i.length) data.r = true
        return data
    }
}

export default filterBy