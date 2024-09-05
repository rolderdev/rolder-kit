import { memo } from 'react';
import type { Item } from 'types';
import type { Column } from '../models/columnModel';
import ExpanderCell from './ExpanderCell';
import AccessorCell from './AccessorCell';
import GetValueCell from './GetValueCell';
import TemplateCell from './TemplateCell';

export default memo((p: { expansionEnabled: boolean; column: Column; item: Item }) => {
	if (p.expansionEnabled && p.column.idx === 0) {
		if (p.column.type === 'accessor' && p.column.accessor)
			return <ExpanderCell itemId={p.item.id} cell={<AccessorCell itemId={p.item.id} columnIdx={p.column.idx} />} />;
		if (p.column.type === 'getValue' && p.column.getValue)
			return (
				<ExpanderCell
					itemId={p.item.id}
					cell={<GetValueCell itemId={p.item.id} itemFid={p.item.fid} columnIdx={p.column.idx} />}
				/>
			);
		if (p.column.type === 'template' && p.column.template)
			return <ExpanderCell itemId={p.item.id} cell={<TemplateCell itemId={p.item.id} columnIdx={p.column.idx} />} />;
	} else {
		if (p.column.type === 'accessor' && p.column.accessor) return <AccessorCell itemId={p.item.id} columnIdx={p.column.idx} />;
		if (p.column.type === 'getValue' && p.column.getValue)
			return <GetValueCell itemId={p.item.id} itemFid={p.item.fid} columnIdx={p.column.idx} />;
		if (p.column.type === 'template' && p.column.template) return <TemplateCell itemId={p.item.id} columnIdx={p.column.idx} />;
	}
	return 'No Cell type';
});
