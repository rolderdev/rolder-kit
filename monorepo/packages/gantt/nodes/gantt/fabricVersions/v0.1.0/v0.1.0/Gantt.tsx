import { forwardRef } from "react"
import { Gantt, Task, ViewMode } from "./lib";
import { sendOutput, sendSignal } from "../../../../../../../libs/nodesFabric/v0.1.0/send/v0.4.0/send";

type CompRpops = {
    ganttTasks: Task[]
    ganttViewMode: ViewMode
    showTaskList: boolean
    noodlNode: NoodlNode
    customProps: any
}

export default forwardRef(function (props: CompRpops) {
    const { noodlNode, ganttTasks: tasks, ganttViewMode, showTaskList } = props

    return props.ganttTasks?.length && <div className="Wrapper">
        <Gantt
            tasks={tasks}
            viewMode={ganttViewMode}
            locale='ru'
            onDateChange={(task) => {
                sendOutput(noodlNode, 'ganttChangedTask', task)
                sendSignal(noodlNode, 'ganttTaskChanged')
            }}
            onDelete={(task) => {
                sendOutput(noodlNode, 'ganttDeletedTask', task)
                sendSignal(noodlNode, 'ganttTaskDeleted')
            }}
            onProgressChange={(task) => {
                sendOutput(noodlNode, 'ganttChangedTask', task)
                sendSignal(noodlNode, 'ganttTaskProgressChanged')
            }}
            onDoubleClick={(task) => {
                sendOutput(noodlNode, 'ganttSelectedTask', task)
                sendSignal(noodlNode, 'doubleClicked')
            }}
            onSelect={(task, isSelected) => {
                if (isSelected) {
                    sendOutput(noodlNode, 'ganttSelectedTask', task)
                    sendSignal(noodlNode, 'selected')
                }
            }}
            onExpanderClick={(task) => {
                sendOutput(noodlNode, 'ganttChangedTask', task)
                sendSignal(noodlNode, 'ganttExpandChanged')
            }}
            listCellWidth={showTaskList ? "180px" : ""}
            columnWidth={
                ganttViewMode === ViewMode.Year
                    ? 350
                    : ganttViewMode === ViewMode.Month
                        ? 300
                        : ganttViewMode === ViewMode.Week
                            ? 250
                            : 65
            }
            {...props}
            {...props.customProps}
        />
    </div>
})