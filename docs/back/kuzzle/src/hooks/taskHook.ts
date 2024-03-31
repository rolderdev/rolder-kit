import { EmbeddedSDK } from "kuzzle";
import dayjs from 'dayjs'
import { Item } from "src/types";

export default function (dbClass: string, items: Item[], sdk: EmbeddedSDK) {
    let updateItems: any[] = []

    items.forEach(item => {
        const { startDate, duration } = item.content.schedule
        const { flow } = item.states

        if (['planned', 'active'].includes(flow.value)) {
            const startDateCalcFact = dayjs(startDate.plan).add(duration.plan, 'minute')
            const diff = dayjs(startDateCalcFact).diff(dayjs())

            if (diff < 0) {
                const flow = {
                    value: 'failed',
                    label: 'Провалена',
                    color: 'red',
                    order: 3
                }
                item.states.flow = flow
                updateItems.push({
                    _id: item.id,
                    body: {
                        states: { flow }
                    }
                })
            }
        }
    })

    sdk.document.mUpdate('startum_v1', dbClass, updateItems, { silent: true })
    return items
}