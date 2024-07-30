import { observer } from 'mobx-react-lite';
import type { RootModel } from '../models/rootModel';
import { Skeleton } from '@mantine/core';
import type { RecordModel } from '../models/recordModel';
import { useEffect } from 'react';

export default observer((p: { root: RootModel; record: RecordModel }) => {
	const { record } = p;

	/* useEffect(() => {
		setTimeout(() => record.setReady(), 2000);
	}, []); */
	//console.log('Cell render', record.item.dbClass);
	return 'TEST';
});
// (
//   <Skeleton visible={!record.ready}>
//     Lorem ipsum dolor sit amet...
//     {/* other content */}
//   </Skeleton>
// );
