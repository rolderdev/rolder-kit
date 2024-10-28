import type { Props } from '../node/definition'

export default (p: Props) => {
	for (const i of p.propsStore.unsubs) i?.()
	for (const i of p.propsStore.deriveUnsubs) R.libs.valtio.underive(i)
}
