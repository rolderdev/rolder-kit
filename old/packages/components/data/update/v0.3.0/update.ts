import isEmpty from '@packages/is-empty'
import { sendOutput, sendSignal } from '@packages/port-send'
import map from 'just-map-object'
import unique from 'just-unique'
import type { Item } from 'types'
import mUpdate from './src/mUpdate'
import updateUser from './src/updateUser'
import type { Props, UpdateScheme, UpdateUser } from './types'

export default {
	async update(props: Props) {
		const { noodlNode, updateScheme } = props

		sendOutput(noodlNode, 'updating', true)

		const orders = unique(updateScheme.map((i) => i.order)).sort()
		const updatePromise = (scheme: UpdateScheme) => mUpdate(scheme)
		const updateUserPromise = (scheme: UpdateUser) => updateUser(scheme)
		const schemeArrays = orders.map((order) => {
			return updateScheme.filter((i) => i.order === order)
		})

		async function executeArrays() {
			const results: any = {}
			for (const schemeArray of schemeArrays) {
				const arrayResults = await Promise.all(
					schemeArray.map((scheme: UpdateScheme) => {
						// save refId for next order
						//@ts-ignore
						if (scheme.items.some((i) => !isEmpty(i.refId))) {
							//@ts-ignore
							results[scheme.dbClass] = scheme.items.map((i) => ({ refId: i.refId }))
							scheme.items = scheme.items.map((i) => {
								//@ts-ignore
								delete i.refId
								return i
							})
						}
						// add ref from prev order
						scheme.items.forEach((item: any) => {
							map(item, (k, v: any) => {
								if (!isEmpty(v.refId)) {
									const refId = results[k]?.find((i: any) => i.refId === v.refId)?.id
									if (refId) item[k] = { id: refId }
									delete v.refId
								}
							})
						})
						if (scheme.dbClass === 'user')
							return Promise.all(
								scheme.items.map((user: any, idx) =>
									updateUserPromise(user).then((user) => ({
										...user,
										refId: results[scheme.dbClass]?.[idx].refId,
									}))
								)
							)
						else
							return updatePromise(scheme).then((items) =>
								items?.map((i, idx) => ({
									...i,
									refId: results[scheme.dbClass]?.[idx].refId,
								}))
							)
					})
				)

				schemeArray.forEach((scheme: UpdateScheme, idx: number) => (results[scheme.dbClass] = arrayResults[idx]))
			}

			map(results, (dbClass, items: Item[]) => {
				results[dbClass] = items.map((i) => {
					//@ts-ignore
					delete i.refId
					return i
				})
			})

			//@ts-ignore
			sendOutput(noodlNode, 'updatedData', results)
			sendSignal(noodlNode, 'updated')
			sendOutput(noodlNode, 'updating', false)
		}

		executeArrays().catch((error) => log.error('update error', error))
	},
}
