import deepMerge from '@packages/deep-merge'
import { dbClassVersion } from '@packages/get-dbclass-version'
import { sendOutput, sendOutputs, sendSignal } from '@packages/port-send'
import { onlineManager } from '@tanstack/react-query'
import clone from 'just-clone'
import type { Item } from 'types'
import type { Props, UpdateScheme } from './types'

// Проверяем указан ли dbClass
function getUpdateScheme(updateScheme: UpdateScheme): UpdateScheme | boolean {
	const resultScheme: UpdateScheme = clone(updateScheme)
	resultScheme.forEach((dbClassScheme) => {
		// Проверяем, включать ли режим silent
		if (dbClassScheme.offlineSilent && !onlineManager.isOnline()) dbClassScheme.silent = true

		// Получаем dbClass с версией
		const dbClass = dbClassVersion(dbClassScheme.dbClass)

		// Заменяем в схеме dbClass без версии классом с версией
		if (dbClass) dbClassScheme.dbClass = dbClass
		// Если нет dbClass с версией, то выдаем ошибку, что dbClass не найден
		else {
			R.libs.mantine?.MantineError?.('Системная ошибка!', `No dbClass at scheme: ${JSON.stringify(dbClassScheme)}`)
			log.error('`No dbClass at scheme', dbClassScheme)
			return false
		}
		// Если нет записей или функции на обновление, то выдаем ошибку
		if (!dbClassScheme.items && !dbClassScheme.itemsFunc) {
			R.libs.mantine?.MantineError?.('Системная ошибка!', `No items or itemsFunc at scheme: ${JSON.stringify(dbClassScheme)}`)
			log.error('No items or itemsFunc at scheme', dbClassScheme)
			return false
		}
		return
	})

	return resultScheme
}

export default {
	async update(props: Props) {
		// Получаем схему, у которой класс указан с версией
		const scheme = getUpdateScheme(props.scheme)

		// Ставим флаг о том, что началось обновление
		sendOutput(props.noodlNode, 'updating', true)

		// Фиксируем время начала
		const startTime = log.start()
		log.info(`update props`, props)

		try {
			// Если мы используем оптимистичное обновление
			if (props.optimistic) {
				const queryClient = R.libs.queryClient

				if (queryClient) {
					// optimistic update
					if (Array.isArray(scheme))
						scheme.map((s) =>
							queryClient.setQueriesData([], (old: any) => {
								const oldCach = old as { [dbClass: string]: { items: Item[] } }
								const dbClass = s.dbClass.split('_')[0]
								const newCache = oldCach
								let oldItems = oldCach[dbClass]?.items
								if (oldItems?.length) {
									s.items?.map((newItem) => {
										oldItems = oldItems.map((oldItem) => {
											if (oldItem.id === newItem.id) oldItem = deepMerge(oldItem, newItem)
											return oldItem
										})
									})

									newCache[dbClass].items = oldItems
								}
							})
						)
				}
				//@ts-ignore
				sendSignal(props.noodlNode, 'optimisticUpdated')
			}

			// Запускаем обновление!
			// const data = R.libs.mutate && await R.libs.mutate({ action: 'update', scheme, silent: props.silent })

			if (Array.isArray(scheme)) {
				// const startTime2 = new Date()

				// Задаем размер чанка
				const chunkSize = 100
				// Задаем корзину, в которой будем хранить записи, наполняя до достижения размера чанка
				const chunkBox: {
					dbClass: string
					history?: boolean
					items: any[]
				}[] = []
				let chunkData = []
				// Задаем объект, хранящий результаты создания записей
				const updateResult: {
					[dbClass: string]: {
						count?: number
						error?: string
						items?: object[]
					}
				} = {}

				// Отщипываем крайний объект первого класса
				const endItem = scheme?.[0]?.items?.pop()

				// let countItems = 0

				// Перебираем схемы классов
				for (const iScheme of scheme) {
					// Обновляем записи по частям
					if (iScheme?.items) {
						// Перебираем записи, и при достижении размера чанка создаем запись
						for (const item of iScheme?.items) {
							chunkData.push(item)
							if (chunkData.length === chunkSize) {
								chunkBox.push({
									dbClass: iScheme.dbClass,
									history: iScheme.history,
									items: chunkData,
								})
								// Очищаем чанк для следующих записей
								chunkData = []
							}
						}

						// Если после перебора остались не созданные записи
						if (chunkData.length > 0) {
							chunkBox.push({
								dbClass: iScheme.dbClass,
								history: iScheme.history,
								items: chunkData,
							})
							// Очищаем чанк для следующих записей
							chunkData = []
						}
					}
				}

				// После того, как мы нарезали схемы классов на чанки, обновляем их, но асинхронно
				await Promise.all(
					chunkBox?.map(async (iChunk) => {
						// Создаем записи из chunk
						const data =
							R.libs.mutate &&
							(await R.libs.mutate({
								action: 'update',
								scheme: [
									{
										dbClass: iChunk.dbClass,
										history: iChunk.history,
										items: iChunk.items,
									},
								],
								silent: true,
								refresh: 'false',
							}))

						// Добавляем результаты
						for (const dbClass in data) {
							if (updateResult?.[dbClass] === undefined) {
								updateResult[dbClass] = {
									count: 0,
									items: [],
								}
							}
							const count = updateResult[dbClass]?.count || 0
							const iCount = data[dbClass]?.count || 0
							updateResult[dbClass].count = count + iCount

							if (data?.[dbClass]?.items) {
								updateResult[dbClass].items = updateResult[dbClass]?.items?.concat(data[dbClass].items)
							}

							if (data?.[dbClass]?.error) {
								updateResult[dbClass].error = data[dbClass].error
							}
						}
					})
				)

				// Обновляем крайний item, чтобы затриггерить useData, еслы silent: false
				const endUpdateReasult =
					R.libs.mutate &&
					(await R.libs.mutate({
						action: 'update',
						scheme: [
							{
								dbClass: scheme?.[0]?.dbClass,
								history: scheme?.[0]?.history,
								items: [endItem],
							},
						],
						silent: props.silent, // Крайний silent берем уже из параметров ноды
						refresh: 'wait_for',
					}))

				// Добавляем результаты
				for (const dbClass in endUpdateReasult) {
					if (updateResult?.[dbClass]?.count === undefined) {
						updateResult[dbClass] = {
							count: 0,
							items: [],
						}
					}
					const count = updateResult[dbClass]?.count || 0
					const iCount = endUpdateReasult[dbClass]?.count || 0
					updateResult[dbClass].count = count + iCount

					if (endUpdateReasult?.[dbClass]?.items !== undefined) {
						updateResult[dbClass].items = updateResult[dbClass]?.items?.concat(endUpdateReasult[dbClass].items)
					}

					if (endUpdateReasult?.[dbClass]?.error) {
						updateResult[dbClass].error = endUpdateReasult[dbClass].error
					}
				}

				// Возвращаем результат обновления и выставляем флаг о том, что оно завершилось
				sendOutputs(props.noodlNode, [
					{ portName: 'data', value: updateResult },
					{ portName: 'updating', value: false },
				])
				// Выдаем сигнал о завершении обновления
				sendSignal(props.noodlNode, 'updated')

				log.info(`updated`, updateResult)
				log.end(`update`, startTime)
			}
		} catch (error: any) {
			R.libs.mantine?.MantineError?.('Системная ошибка!', `update error: ${error.message}`)
			log.error('update error', error)
		}
	},
}
