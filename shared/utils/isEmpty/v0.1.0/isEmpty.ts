//// DEPRECATED

import '@shared/types-v0.1.0';

export default function (value: any): boolean {
	const { typeOf, isEmpty } = R.libs.just;

	if (typeof value === 'boolean') return false;
	if (typeof value === 'number') return false;
	// @ts-ignore
	if (typeOf(value) === 'object' && isEmpty(value)) return true;
	return !Boolean(value);
}
