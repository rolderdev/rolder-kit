import { jsNode } from '@packages/node';
import { getPort, getPorts } from '@packages/port';

export default jsNode(
	'updateByQuery',
	{
		'v1.0.0': { // Vezdexod
			module: {
				dynamic: import("@packages/update-by-query-v1.0.0")
			},
			inputs: [
				...getPorts('input', ['update']),
				getPort({
					plug: 'input',
					name: 'scheme',
					displayName: 'Scheme',
					group: 'Params',
					type: 'array',
					customs: {
						required: 'connection',
						validate(p) {
							if (!p.scheme) return true;
							else {
								const sizeDbClasses: string[] = [];
								p.scheme.map((i: any) => {
									if (i.items?.length > 20000) sizeDbClasses.push(i.dbClass);
								});
								if (sizeDbClasses.length) {
									return `You can update 20000 or less documents per request. Mismatched DB classes: ${sizeDbClasses.join(', ')}`;
								} else return true;
							}
						}
					}
				}),
				getPort({
					plug: 'input',
					name: 'optimistic',
					displayName: 'Optimistic',
					group: 'Params',
					type: 'boolean',
					default: false
				}),
				getPort({
					plug: 'input',
					name: 'silent',
					displayName: 'Silent',
					group: 'Params',
					type: 'boolean',
					default: false
				})
			],
			outputs: [
				...getPorts('output', ['updated', 'updating', 'data']),
				getPort({
					plug: 'output',
					name: 'optimisticUpdated',
					displayName: 'Optimistic updated',
					group: 'Signals',
					type: 'signal',
					customs: {
						dependsOn(p) {
							return p.optimistic ? true : false;
						}
					}
				})
			]
		}
	},
	{ docs: 'https://docs.rolder.app/docs/data/update-by-query.html' }
);
