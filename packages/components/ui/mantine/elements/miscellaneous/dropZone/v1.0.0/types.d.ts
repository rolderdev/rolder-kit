import { BaseReactProps } from '@packages/node'

export type Props = BaseReactProps & {
  dropZoneTitle?: string
  acceptedType: '*' | 'pdf' | 'excel' | 'image'
  acceptIconName: string
  rejectIconName: string
  idleIconName: string
  iconSize?: string
  stroke?: number
}