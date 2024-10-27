import type { JsComponent } from '@shared/node-v1.0.0'
import { sendOutput } from '@shared/port-send-v1.0.0'
import type { Props } from '../node/definition'

export default {
	reactive: (p: Props, noodlNode) => {
		if (p.number) {
			const numbro = R.libs.numbro

			let numberString: string
			if (p.custom) numberString = numbro(p.number).format(p.customFormat)
			else if (p.currency)
				numberString = numbro(p.number).formatCurrency({
					mantissa: p.mantissa,
					thousandSeparated: p.thousandSeparated,
					spaceSeparated: p.spaceSeparated,
				})
			else numberString = numbro(p.number).format({ mantissa: p.mantissa, thousandSeparated: p.thousandSeparated })

			sendOutput(noodlNode, 'string', numberString)
		}
	},
} as JsComponent
