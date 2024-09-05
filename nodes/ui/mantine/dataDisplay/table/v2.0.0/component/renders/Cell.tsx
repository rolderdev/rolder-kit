import { useContext } from 'react';
import { TableContext } from '../TableProvider';
import AccessorCell from './AccessorCell';
import GetValueCell from './GetValueCell';
import TemplateCell from './TemplateCell';
import CustomCell from './CustomCell';

export default (p: { columnIdx: string; id: string }) => {
	const store = useContext(TableContext);
	const type = R.libs.just.get(store, ['columnsDefinition', p.columnIdx, 'type']);

	if (type === 'accessor') return <AccessorCell id={p.id} columnIdx={p.columnIdx} />;
	if (type === 'getValue') return <GetValueCell id={p.id} columnIdx={p.columnIdx} />;
	if (type === 'custom') return <CustomCell id={p.id} columnIdx={p.columnIdx} />;
	if (type === 'template') return <TemplateCell id={p.id} columnIdx={p.columnIdx} />;

	return 'No Cell type';
};
