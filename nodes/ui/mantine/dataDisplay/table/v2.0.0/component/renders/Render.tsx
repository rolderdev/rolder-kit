import type { Column } from '../models/columnModel';
import AccessorCell from './AccessorCell';
import GetValueCell from './GetValueCell';
import TemplateCell from './TemplateCell';

export default (p: { column: Column; itemId: string }) => {
	if (p.column.type === 'accessor') return <AccessorCell itemId={p.itemId} columnIdx={p.column.idx} />;
	if (p.column.type === 'getValue') return <GetValueCell itemId={p.itemId} columnIdx={p.column.idx} />;
	if (p.column.type === 'template') return <TemplateCell itemId={p.itemId} columnIdx={p.column.idx} />;

	return 'No Cell type';
};
