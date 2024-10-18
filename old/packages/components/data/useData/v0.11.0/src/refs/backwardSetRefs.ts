import type { NoodlNode } from '@packages/node'
import type { DataScheme } from '../../types'
import { dataCache } from '../data'
import sendUseDataOutput from '../sendUseDataOutput'
import { setBackRefs, setRefs } from './setRefs'

export default function (noodlNode: NoodlNode, useDataScheme: DataScheme[], dataScheme: DataScheme) {
	const refItems = dataCache.get()[noodlNode.id]?.[dataScheme.dbClass]
	useDataScheme.forEach((targetDS) => {
		let targetItems = dataCache.get()[noodlNode.id]?.[targetDS.dbClass]
		const tagetRefs = targetDS.refs?.filter((i) => dataScheme.dbClass === i)
		tagetRefs?.forEach(() => {
			if (targetItems?.length) targetItems = setRefs(targetItems, dataScheme.dbClass, refItems)
		})
		const tagetBackRefs = targetDS.backRefs?.filter((i) => dataScheme.dbClass === i)
		tagetBackRefs?.forEach(() => {
			if (targetItems?.length) targetItems = setBackRefs(targetDS.dbClass, targetItems, dataScheme.dbClass, refItems)
		})
		if (targetItems?.length) sendUseDataOutput(noodlNode, targetDS.dbClass, targetItems)
	})
}
