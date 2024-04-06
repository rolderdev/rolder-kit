import { ColorScheme } from '@mantine/core'
import { BaseReactProps } from '@packages/node'
import { RolderType } from '@packages/types'

export type CompProps = BaseReactProps & {
    appLoaderColor?: string
    colorScheme: ColorScheme | 'auto'    
}