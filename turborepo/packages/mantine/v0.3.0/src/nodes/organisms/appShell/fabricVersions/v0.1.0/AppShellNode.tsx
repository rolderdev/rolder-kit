import { CompVersions, getPorts, getReactNode } from '@rk/node-fabrik'

import v0_2_0 from './v0.2.0/AppShell'

//===================================================================

const compVersions: CompVersions = {
    'v0.2.0': {
        Comp: v0_2_0,
        inputs: [...getPorts('input', ['appShellLayout', 'appShellPadding', 'appShellCustomPadding', 'hiddenAppShell', 'opacity'])]
    }
}

//===================================================================

export default getReactNode('AppShell', compVersions, true)