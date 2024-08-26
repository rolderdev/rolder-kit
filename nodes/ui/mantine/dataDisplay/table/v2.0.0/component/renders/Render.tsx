import type { Column } from '../models/columnModel';
import AccessorCell from './AccessorCell';
import GetValueCell from './GetValueCell';
import TemplateCell from './TemplateCell';

export default (p: { column: Column; id: string }) => {
	if (p.column.type === 'accessor') return <AccessorCell id={p.id} columnIdx={p.column.idx} />;
	if (p.column.type === 'getValue') return <GetValueCell id={p.id} columnIdx={p.column.idx} />;
	if (p.column.type === 'template') return <TemplateCell id={p.id} columnIdx={p.column.idx} />;

	return 'No Cell type';
};
