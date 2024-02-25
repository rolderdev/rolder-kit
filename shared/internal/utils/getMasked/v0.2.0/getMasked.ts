import IMask from "imask"

export default function (
    maskProps: {
        type: 'pattern' | 'number'
        maskPattern?: string // for pattern type
        numberScale?: number // digits after dot, default 2 
        thousandsSeparator?: string // default ' '
        radix?: string // default '.'
    },
    value: string
) {
    let resultProps = {}
    switch (maskProps.type) {
        case 'number': resultProps = {
            mask: Number,
            scale: maskProps.numberScale || 2,
            thousandsSeparator: maskProps.thousandsSeparator || ' ',
            radix: maskProps.radix || '.'
        }; break
        default: resultProps = { mask: maskProps.maskPattern || '' }
    }
    
    if (value) {
        const masked = IMask.createMask(resultProps);
        masked.resolve(value);
        return masked.value
    }
}