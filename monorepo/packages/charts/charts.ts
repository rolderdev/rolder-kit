import nodesStore from './nodes/nodesStore'

import { plot, ruleY, dot, barY, groupX } from "@observablehq/plot"
window.R.libs.plot = { plot, ruleY, dot, barY, groupX }

import { defineModule } from '@noodl/noodl-sdk'
defineModule({ reactNodes: nodesStore })