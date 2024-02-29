import { BaseReactProps } from '@shared/node'
import { Gantt, Task, ViewMode } from "./src/lib";

export type Props = BaseReactProps & {
    ganttTasks: Task[]
    ganttViewMode: ViewMode
    showTaskList: boolean
}