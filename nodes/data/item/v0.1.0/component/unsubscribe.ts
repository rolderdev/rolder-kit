import type { Props } from '../node/definition';

export default (p: Props) => {
	p.propsStore.unsubs.forEach((i) => i?.());
	p.propsStore.deriveUnsubs.forEach((i) => R.libs.valtio.underive(i));
};
