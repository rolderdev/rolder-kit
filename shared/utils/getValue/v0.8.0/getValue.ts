//// DEPRECATED

export default function (item: any, target: string, defaultValue?: any, defaultTarget?: string) {
	if (item && target) {
		const { get, template } = R.libs.just;

		const hasTemplate = target.split('{{')?.length > 1;
		if (defaultTarget && !get(item, defaultTarget)) return defaultValue;
		if (hasTemplate) return template(target, item);
		return get(item, target, defaultValue);
	}
	return undefined;
}
