import type { BaseReactProps } from '@packages/node'
import { Gantt, type Task, type ViewMode } from './src/lib'

export type Props = BaseReactProps & {
	ganttTasks: Task[]
	ganttViewMode: ViewMode
	showTaskList: boolean
}
