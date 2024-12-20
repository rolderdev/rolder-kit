import { sendOutput, sendSignal } from '@packages/port-send'
import clone from 'just-clone'
import type { DeleteScheme, Props } from './types'

function getDeleteScheme(deleteScheme: DeleteScheme): DeleteScheme | boolean {
	const resultScheme: DeleteScheme = clone(deleteScheme)
	resultScheme.forEach((dbClassScheme) => {
		if (!dbClassScheme.dbClass) {
			R.libs.mantine?.MantineError?.('Системная ошибка!', `No dbClass at scheme: ${JSON.stringify(dbClassScheme)}`)
			log.error('`No dbClass at scheme', dbClassScheme)
			return false
		}
		if (!dbClassScheme.ids && !dbClassScheme.idsFunc) {
			R.libs.mantine?.MantineError?.('Системная ошибка!', `No ids or idsFunc at scheme: ${JSON.stringify(dbClassScheme)}`)
			log.error('No ids or idsFunc at scheme', dbClassScheme)
			return false
		}
		return
	})

	return resultScheme
}

export default {
	async delete(props: Props) {
		const scheme = getDeleteScheme(props.scheme)

		sendOutput(props.noodlNode, 'deleting', true)

		const startTime = log.start()
		log.info(`delete props`, props)

		try {
			R.libs.mutate && (await R.libs.mutate({ action: 'delete', scheme, silent: props.silent }))

			sendOutput(props.noodlNode, 'deleting', false)
			sendSignal(props.noodlNode, 'deleted')

			log.end(`delete`, startTime)
		} catch (error: any) {
			R.libs.mantine?.MantineError?.('Системная ошибка!', `delete error: ${error.message}`)
			log.error('delete error', error)
		}
	},
}
