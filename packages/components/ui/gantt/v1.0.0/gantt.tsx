import { forwardRef } from "react"
import type { Props } from "./types"
import { sendOutput, sendSignal } from "@packages/port-send"
import { Gantt, ViewMode } from "./src/lib"

export default forwardRef(function (props: Props) {
    const { noodlNode, ganttTasks: tasks, ganttViewMode, showTaskList } = props

    return props.ganttTasks?.length
        ? <div
            className="Wrapper"
            {...props}
            {...props.customProps}
        >
            <Gantt
                tasks={tasks}
                viewMode={ganttViewMode}
                locale='ru'
                onDateChange={(task) => {
                    //@ts-ignore
                    sendOutput(noodlNode, 'ganttChangedTask', task)
                    //@ts-ignore
                    sendSignal(noodlNode, 'ganttTaskChanged')
                }}
                onDelete={(task) => {
                    //@ts-ignore
                    sendOutput(noodlNode, 'ganttDeletedTask', task)
                    //@ts-ignore
                    sendSignal(noodlNode, 'ganttTaskDeleted')
                }}
                onProgressChange={(task) => {
                    //@ts-ignore
                    sendOutput(noodlNode, 'ganttChangedTask', task)
                    //@ts-ignore
                    sendSignal(noodlNode, 'ganttTaskProgressChanged')
                }}
                onDoubleClick={(task) => {
                    //@ts-ignore
                    sendOutput(noodlNode, 'ganttSelectedTask', task)
                    sendSignal(noodlNode, 'doubleClicked')
                }}
                onSelect={(task, isSelected) => {
                    if (isSelected) {
                        //@ts-ignore
                        sendOutput(noodlNode, 'ganttSelectedTask', task)
                        sendSignal(noodlNode, 'selected')
                    }
                }}
                onExpanderClick={(task) => {
                    //@ts-ignore
                    sendOutput(noodlNode, 'ganttChangedTask', task)
                    //@ts-ignore
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
        : null
})
