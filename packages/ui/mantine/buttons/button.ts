import { reactNode } from '@shared/node-v1.0.0';

import v200 from '@nodes/button-v2.0.0';

const button = reactNode(
	'Button',
	{
		'v2.0.0': v200,
	},
	{ allowChildren: true, docs: '' }
);

import lsV010 from '@nodes/button-left-section-v0.1.0';

const buttonLeftSection = reactNode(
	'ButtonLeftSection',
	{
		'v0.1.0': lsV010,
	},
	{ allowChildren: true, docs: '' }
);

import rsV010 from '@nodes/button-right-section-v0.1.0';

const buttonRightSection = reactNode(
	'ButtonRightSection',
	{
		'v0.1.0': rsV010,
	},
	{ allowChildren: true, docs: '' }
);

export { button, buttonLeftSection, buttonRightSection };
