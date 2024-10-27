import { merge } from '@shared/item-v0.1.0'
import type { JsComponent } from '@shared/node-v1.0.0'
import { sendOutput, sendSignal } from '@shared/port-send-v1.0.0'
import type { Props } from '../node/definition'
import kUpdate, { type BackendData } from './kUpdate'

export default {
	update: async (p: Props, noodlNode) => {
		if (p.updateScheme?.length) {
			// Выясним примерный размер отправляемго запроса.
			let megaBytes = 0
			for (const scheme of p.updateScheme) {
				const size = new TextEncoder().encode(JSON.stringify(scheme.items)).length
				megaBytes += size / 1024 / 1024
			}
			log.info(`Update node request size: ${megaBytes} MB`)

			if (megaBytes > 1) {
				log.error(`Update node request size exceeded 1 MB. Got ${megaBytes} MB`)
				R.libs.mantine.MantineError?.('Системная ошибка!', `Update node request size exceeded 1 MB. Got ${megaBytes} MB`)
			}

			// Обновим оптимистично.
			if (p.optimistic) {
				const { unset } = R.libs.lodash
				const { omit, clone } = R.libs.just

				for (const scheme of p.updateScheme) {
					for (const schemeItem of scheme.items) {
						// Нужно клонировать перед мутацией, т.к. разарботчик может положить части прокси в item, что мутирует его и запишет не верно в БД.
						const clonedItem = clone(schemeItem)
						const proxyItem = R.items[clonedItem.id]
						if (proxyItem) {
							// merge - мутирует прокси, что нам и нужно, т.к. заменять прокси нельзя, потеряем точечную реактивность.
							// Нам не нужен history в item.
							// Пропустим удаление в merge, т.к. в item схемы только новые данные.
							merge({ object: proxyItem, proxyObject: omit(clonedItem, ['history', 'deleteFields']), skipDelete: true })
							// Удалим ключи. Это работает и для конструкции - someArray[0].someField
							if (schemeItem.deleteFields?.length) schemeItem.deleteFields.map((i) => unset(proxyItem, i))
						}
					}
				}
			}

			// Обновление истории.
			for (const scheme of p.updateScheme) {
				for (const schemeItem of scheme.items) {
					if (schemeItem.history) {
						const itemHistoryProxy = R.itemsHistory[schemeItem.id]
						const proxyItem = R.items[schemeItem.id]
						const newHistoryItem = R.libs.just.clone({
							item: proxyItem,
							timestamp: R.libs.dayjs().valueOf(),
							metaData: schemeItem.history,
						})
						if (!itemHistoryProxy && proxyItem) R.itemsHistory[schemeItem.id] = [newHistoryItem]
						// Нужно класть в начало массива, как это делает бек при загрузке истории.
						if (itemHistoryProxy && proxyItem) R.itemsHistory[schemeItem.id].unshift(newHistoryItem)
					}
				}
			}

			sendOutput(noodlNode, 'updating', true)
			const data: BackendData['data'] | undefined = await kUpdate(p, p.updateScheme)
			sendOutput(noodlNode, 'data', data)
			sendOutput(noodlNode, 'updating', false)
			sendSignal(noodlNode, 'updated')
		}
	},
} as JsComponent
