import { Skeleton } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import type { RecordModel } from '../models/recordModel'
import type { RootModel } from '../models/rootModel'

export default observer((p: { root: RootModel; record: RecordModel }) => {
	const { record } = p

	/* useEffect(() => {
		setTimeout(() => record.setReady(), 2000);
	}, []); */
	//console.log('Cell render', record.item.dbClass);
	return 'TEST'
})
// (
//   <Skeleton visible={!record.ready}>
//     Lorem ipsum dolor sit amet...
//     {/* other content */}
//   </Skeleton>
// );
