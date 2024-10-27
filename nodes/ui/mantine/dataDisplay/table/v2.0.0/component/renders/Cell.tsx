import { useStore } from '../store'
import AccessorCell from './AccessorCell'
import CustomCell from './CustomCell'
import GetValueCell from './GetValueCell'
import TemplateCell from './TemplateCell'

export default (p: { tableId: string; id: string; columnId: string; isFirst: boolean }) => {
	const s = useStore(p.tableId)
	const type = s.columns[p.columnId].type

	if (type === 'accessor') return <AccessorCell tableId={p.tableId} id={p.id} columnId={p.columnId} isFirst={p.isFirst} />
	if (type === 'getValue') return <GetValueCell tableId={p.tableId} id={p.id} columnId={p.columnId} isFirst={p.isFirst} />
	if (type === 'custom') return <CustomCell tableId={p.tableId} id={p.id} columnId={p.columnId} isFirst={p.isFirst} />
	if (type === 'template') return <TemplateCell tableId={p.tableId} id={p.id} columnId={p.columnId} isFirst={p.isFirst} />

	return null
}
