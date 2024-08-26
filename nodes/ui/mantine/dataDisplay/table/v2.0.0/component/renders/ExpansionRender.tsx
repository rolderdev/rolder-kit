import type { Column } from '../models/columnModel';
import AccessorCell from './AccessorCell';
import ExpanderCell from './ExpanderCell';
import GetValueCell from './GetValueCell';
import TemplateCell from './TemplateCell';

export default (p: { column: Column; id: string }) => {
	if (p.column.type === 'accessor') return <ExpanderCell id={p.id} cell={<AccessorCell id={p.id} columnIdx={p.column.idx} />} />;
	if (p.column.type === 'getValue') return <ExpanderCell id={p.id} cell={<GetValueCell id={p.id} columnIdx={p.column.idx} />} />;
	if (p.column.type === 'template') return <ExpanderCell id={p.id} cell={<TemplateCell id={p.id} columnIdx={p.column.idx} />} />;

	return 'No Cell type';
};
