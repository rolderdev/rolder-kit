import { ColorScheme } from '@mantine/core'
import { BaseReactProps } from '@shared/node'
import { RolderType } from '@shared/types'

export type CompProps = BaseReactProps & {
    appLoaderColor?: string
    colorScheme: ColorScheme | 'auto'    
}