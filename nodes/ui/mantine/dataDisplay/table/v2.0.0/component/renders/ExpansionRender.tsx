import type { Column } from '../models/columnModel';
import AccessorCell from './AccessorCell';
import ExpanderCell from './ExpanderCell';
import GetValueCell from './GetValueCell';
import TemplateCell from './TemplateCell';

export default (p: { column: Column; itemId: string }) => {
	if (p.column.type === 'accessor')
		return <ExpanderCell itemId={p.itemId} cell={<AccessorCell itemId={p.itemId} columnIdx={p.column.idx} />} />;
	if (p.column.type === 'getValue')
		return <ExpanderCell itemId={p.itemId} cell={<GetValueCell itemId={p.itemId} columnIdx={p.column.idx} />} />;
	if (p.column.type === 'template')
		return <ExpanderCell itemId={p.itemId} cell={<TemplateCell itemId={p.itemId} columnIdx={p.column.idx} />} />;

	return 'No Cell type';
};
