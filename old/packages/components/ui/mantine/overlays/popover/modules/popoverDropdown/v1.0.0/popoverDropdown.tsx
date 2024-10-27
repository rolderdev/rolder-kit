import { forwardRef } from 'react'
import type { Props } from './types'

export default forwardRef((props: Props) => <>{props.children}</>)
