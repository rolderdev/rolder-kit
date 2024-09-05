import { reactNode } from '@packages/node';
import { getPorts } from '@packages/port';
import { lazy } from 'react';

export default reactNode(
	'Carousel',
	{
		'v1.0.0': {
			module: {
				dynamic: lazy(() => import('@packages/carousel-v1.0.0'))
			},
			inputs: [...getPorts('input', ['customProps'])]
		}
	},
	{ allowChildren: true }
);
