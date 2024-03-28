import { BaseReactProps } from '@shared/node'

export type Props = BaseReactProps & {
    fonts?: {
        family: string;
        fonts: {
            src: string;
            fontStyle?: string;
            fontWeight?: | number | 'thin' | 'ultralight' | 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'ultrabold' | 'heavy';
            [key: string]: any;
        }[];
    }[]
}