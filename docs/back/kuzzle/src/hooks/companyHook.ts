import { KDocumentContent, KuzzleRequest, KDocument, EmbeddedSDK } from "kuzzle";
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { Item } from "src/types";
dayjs.extend(utc)

export default function (dbClass: string, items: Item[], sdk: EmbeddedSDK) {
    let updateItems: any[] = []

    items.forEach(item => {
        const { subscription } = item.states

        if (subscription.value !== 'notRegistered') {
            if (item.content?.subscription) {
                const { balance, dayCost, date } = item.content?.subscription

                const secondsLeftFromNow = dayjs(date.end).diff(dayjs().utc(), 's')
                const newBalance: number = secondsLeftFromNow * dayCost / 86400

                if (newBalance !== balance) {
                    let newEndDate: number = dayjs().utc().add(secondsLeftFromNow, 's').valueOf()
                    switch (true) {
                        case secondsLeftFromNow > 7 * 86400: item.states.subscription = { value: 'active', label: 'Активна' }; break
                        case secondsLeftFromNow <= 7 * 86400 && secondsLeftFromNow > 0: item.states.subscription =
                            { value: 'ending', label: 'Заканчивается' }; break
                        case secondsLeftFromNow <= 0: item.states.subscription = { value: 'ended', label: 'Закончилась' }; break
                    }
                    item.content.subscription.balance = newBalance
                    item.content.subscription.date.end = newEndDate

                    updateItems.push({
                        _id: item.id,
                        body: {
                            states: { subscription: item.states.subscription },
                            content: {
                                subscription: {
                                    balance: newBalance,
                                    date: { end: newEndDate }
                                }
                            }
                        }
                    })
                }
            }
        }
    })

    sdk.document.mUpdate('startum_v1', dbClass, updateItems, { silent: true })
    return items
}