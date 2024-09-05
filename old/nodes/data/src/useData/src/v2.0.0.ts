import { array, boolean, brand, looseObject, object, optional, parse, picklist, pipe, string, type InferOutput } from 'valibot';

export const PropsScheme = pipe(
	object({
		apiVersion: picklist(['v0', 'v1']),
		fetchScheme: array(looseObject({ dbClass: string(), dbClassV: optional(string()), filters: optional(looseObject({})) })),
		controlled: boolean(),
		subscribe: boolean(),
		subscribeScheme: optional(
			array(looseObject({ dbClass: string(), dbClassV: optional(string()), filters: optional(looseObject({})) }))
		),
	}),
	brand('Props')
);

export const getStore = async (p: any) => {
	const m = await import('@davstack/store');
	return m.store(parse(PropsScheme, p));
};

export const validateDbClasses = (scheme: { dbClass: string }[]) => {
	let dbClasses: string[] = [];
	const noDbClasses: any[] = [];
	const notUniqueDbClasses: string[] = [];
	const notExistsDbClasses: string[] = [];
	scheme.map((i: any) => {
		if (!i.dbClass) noDbClasses.push(i);
		else {
			if (dbClasses.includes(i.dbClass)) notUniqueDbClasses.push(i.dbClass);
			else dbClasses.push(i.dbClass);
		}
		if (!R.dbClasses?.[i.dbClass]) notExistsDbClasses.push(i.dbClass);
	});

	if (noDbClasses.length)
		return `Some schemes has no dbClass.</br>Mismatched schemes: ${noDbClasses.map((i) => JSON.stringify(i, null, '</br>'))}`;
	if (notUniqueDbClasses.length) return `dbClass must be unique.</br>Duplicated DB classes: ${notUniqueDbClasses.join(', ')}`;
	if (notExistsDbClasses.length)
		return `Some dbClasses does not exist at config.</br>Not existed DB classes: ${notExistsDbClasses.join(', ')}`;

	return true;
};
