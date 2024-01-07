import { getReactNode } from '../../../../../../libs/nodesFabric/v0.1.0/getNode/v0.7.0/getNode'
import { getPorts } from '../../../../../../libs/nodesFabric/v0.1.0/portsFabric/v0.5.0/get'

import v0_1_0 from './v0.1.0/Gantt'

//===================================================================

const compVersions: CompVersions = {
    'v0.1.0': {
        Comp: v0_1_0,
        inputs: getPorts('input', ['ganttTasks', 'ganttViewMode', 'showTaskList', 'ganttHeight']),
        outputs: getPorts('output', [
            'ganttTaskChanged', 'ganttChangedTask', 'ganttExpandChanged', 'ganttTaskDeleted', 'ganttDeletedTask',
            'ganttTaskProgressChanged', 'selected', 'ganttSelectedTask', 'doubleClicked'
        ])
    }
}

//===================================================================

export default getReactNode('Gantt', compVersions)