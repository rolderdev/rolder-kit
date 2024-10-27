import { sendOutput, sendSignal } from '@packages/port-send'
import deleteUsers from './src/deleteUsers'
import mDelete from './src/mDelete'
import type { DeleteScheme, Props } from './types'

export default {
	async delete(props: Props) {
		const { noodlNode, deleteScheme } = props

		sendOutput(noodlNode, 'deleting', true)

		const mDeletePromise = (scheme: DeleteScheme) => mDelete(scheme)
		const deleteUsersPromise = (deleteUserIds: string[]) => deleteUsers(deleteUserIds)

		if (deleteScheme) {
			await Promise.all(
				deleteScheme.map((scheme: DeleteScheme) => {
					if (scheme.dbClass === 'user') return deleteUsersPromise(scheme.ids)
					else return mDeletePromise(scheme)
				})
			).then(() => {
				sendOutput(noodlNode, 'deleting', false)
				sendSignal(noodlNode, 'deleted')
			})
		}
	},
}
