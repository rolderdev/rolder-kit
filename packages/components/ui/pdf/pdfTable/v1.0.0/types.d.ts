import { Styles } from '@react-pdf/renderer'
import type { Item } from 'types'

export type Props = {
    children: any
    columns: Column[]    
    items?: Item[]
    wrap: boolean    
    wrapChildren: boolean
    noHeader?: boolean
    style?: Styles['string']
    childrenAccessor?: string
    isChild?: boolean
}

export type Cell = {
    type: 'text' | 'image' | 'link'
    text?: string
    linkTitle?: string
    width?: number
    align?: 'left' | 'center' | 'right'
    cellStyle?: {
        cell?: Styles['string']
        text?: Styles['string']
        image?: Styles['string']
    }
    totalElements?: number
    widthArray?: number[]    
    isFirst?: boolean
}

export type Row = {
    children: any    
    width?: number
    height?: number    
    style?: Styles['string']
    isFirst?: boolean
    isFixed?: boolean
}

export type Column = {
    accessor: string
    type?: 'text' | 'image' | 'link'
    title?: string
    linkTitleAccessor?: string
    width?: number
    headerAlign?: 'left' | 'center' | 'right'
    cellAlign?: 'left' | 'center' | 'right'
    headerStyle?: {
        cell?: Styles['string']
        text?: Styles['string']
    }
    cellStyle?: {
        cell?: Styles['string']
        text?: Styles['string']
        image?: Styles['string']
    }
    textStyle?: Styles['string']
    imageStyle?: Styles['string']
}