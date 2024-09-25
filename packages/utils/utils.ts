import getValue8 from '@shared/get-value-v0.8.0';
import getMasked2 from '@shared/get-masked-v0.2.0';
import getFormatedDate2 from '@shared/get-formated-date-v0.2.0';
import isEmpty from '@shared/is-empty-v0.1.0';
import naturalSort from '@shared/natural-sort-v0.1.0';
import { set } from 'shared/src/libs/just';

const utils = {
	getValue: { v8: getValue8 },
	getFormatedDate: { v2: getFormatedDate2 },
	getMasked: { v2: getMasked2 },
	isEmpty: { v1: isEmpty },
	naturalSort: { v1: naturalSort },
};

export type Utils = typeof utils;
set(window, ['R', 'utils'], utils);

import '@shared/types-v0.1.0';
//@ts-ignore
import { defineNode } from '@noodl/noodl-sdk';

import formatNumber from './src/formatNumber';
import formatDate from './src/formatDate';

const jsPackages = [formatNumber, formatDate];

set(
	window,
	['R', 'packages', 'utils'],
	[
		{
			name: 'Rolder Kit - Utils',
			type: '',
			subCategories: [
				{
					name: '',
					items: ['rolder-kit.api-v1.formatNumber', 'rolder-kit.api-v1.formatDate'],
				},
			],
		},
	]
);

Noodl.defineModule({ name: 'utils', nodes: jsPackages.map(defineNode) });
