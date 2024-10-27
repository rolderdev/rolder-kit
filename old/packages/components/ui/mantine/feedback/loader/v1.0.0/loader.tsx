import { Loader } from '@mantine/core'
import { forwardRef } from 'react'
import type { Props } from './types'

export default forwardRef((props: Props) => <Loader variant={props.loaderVariant} {...props} {...props.customProps} />)
