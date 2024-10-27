import { forwardRef } from 'react'
import type { Props } from '../node/definition'

export default forwardRef((p: Props) => p.children)
