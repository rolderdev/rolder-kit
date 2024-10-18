import type { NoodlNode } from '@packages/node'
import React, { Suspense } from 'react'
import type { Item } from 'types'

function guid() {
	function s4() {
		return Math.floor((1 + Math.random()) * 0x10000)
			.toString(16)
			.substring(1)
	}
	return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4()
}

const ExpansionRow = (props: any) => {
	const { noodlNode, record } = props

	const ExpansionRow = noodlNode.nodeScope
		.createNode('/App/TestTemplate', guid(), { expansionItem: record })
		.then((itemNode: any) => {
			console.log(itemNode.render().props.noodlNode.reactComponent)
			return itemNode.render().props.noodlNode.reactComponent.render()
		})

	return <Suspense fallback="Loading...">{() => ExpansionRow()}</Suspense>
}
export default ExpansionRow
