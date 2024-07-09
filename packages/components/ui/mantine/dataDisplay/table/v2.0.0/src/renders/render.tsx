import type { Item } from 'types';
import type { Column } from '../models/columnModel';
import ExpanderCell from './ExpanderCell';
import AccessorCell from './AccessorCell';
import GetValueCell from './GetValueCell';
import TemplateCell from './TemplateCell';

export default function (expansionEnabled: boolean, column: Column, item: Item) {
	if (expansionEnabled && column.expander) {
		if (column.type === 'accessor' && column.accessor)
			return <ExpanderCell itemId={item.id} cell={<AccessorCell itemId={item.id} accessor={column.accessor} />} />;
		if (column.type === 'getValue' && column.getValue)
			return <ExpanderCell itemId={item.id} cell={<GetValueCell itemId={item.id} columnIdx={column.idx} />} />;
		if (column.type === 'template' && column.template)
			return <ExpanderCell itemId={item.id} cell={<TemplateCell itemId={item.id} columnIdx={column.idx} />} />;
	} else {
		if (column.type === 'accessor' && column.accessor) return <AccessorCell itemId={item.id} accessor={column.accessor} />;
		if (column.type === 'getValue' && column.getValue) return <GetValueCell itemId={item.id} columnIdx={column.idx} />;
		if (column.type === 'template' && column.template) return <TemplateCell itemId={item.id} columnIdx={column.idx} />;
	}
	return 'No Cell type';
}
