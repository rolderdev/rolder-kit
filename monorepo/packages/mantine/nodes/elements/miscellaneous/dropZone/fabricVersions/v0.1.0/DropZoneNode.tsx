import { getReactNode } from '../../../../../../../../libs/nodesFabric/v0.1.0/getNode/v0.7.0/getNode'
import { getPorts } from '../../../../../../../../libs/nodesFabric/v0.1.0/portsFabric/v0.5.0/get'
import v0_1_0 from './v0.1.0/DropZone'

//===================================================================

const compVersions: CompVersions = {
    'v0.1.0': {
        Comp: v0_1_0,
        inputs: [
            ...getPorts(
                'input',                // Тип
                [                       // Названия портов
                    'disabled',
                    'radius',
                    'w',
                    'h',
                    'dropZoneTitle',
                    'loading',
                    'acceptIconName',
                    'rejectIconName',
                    'idleIconName',
                    'iconSize',
                    'stroke',
                    'acceptedType'
                ],
                [                       // список обязательных полей!!!
                    'acceptIconName',
                    'rejectIconName',
                    'idleIconName',
                ]
            ),
        ],

        outputs: getPorts(              // сигналы на выходы тоже здесь
            'output',
            [
                'fileName',
                'file',
                'loaded',               // сигнал
                'rejected'              // сигнал
            ]
        ),

        signals: getPorts( // сигналы на вход нужно задавать отдельно
            'input',
            [
                'reset'                 // триггер
            ]
        )
    }
}

//===================================================================

export default getReactNode('DropZone', compVersions, false)