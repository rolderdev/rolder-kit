import { useStore } from '../store'
import AccessorCell from './AccessorCell'
import CustomCell from './CustomCell'
import GetValueCell from './GetValueCell'
import TemplateCell from './TemplateCell'

export default (p: { tableId: string; columnIdx: string; id: string }) => {
	const s = useStore(p.tableId)
	const type = s.columns[p.columnIdx].type

	if (type === 'accessor') return <AccessorCell tableId={p.tableId} id={p.id} columnIdx={p.columnIdx} />
	if (type === 'getValue') return <GetValueCell tableId={p.tableId} id={p.id} columnIdx={p.columnIdx} />
	if (type === 'custom') return <CustomCell tableId={p.tableId} id={p.id} columnIdx={p.columnIdx} />
	if (type === 'template') return <TemplateCell tableId={p.tableId} id={p.id} columnIdx={p.columnIdx} />

	return null
}
