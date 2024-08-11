import isEqual from 'lodash.isequal';
import type { Props } from '../types';

export const schemeChanged = (currentScheme?: Props['fetchScheme'], newScheme?: Props['fetchScheme']) => {
	if (currentScheme && newScheme) {
		if (currentScheme.length !== newScheme.length) return true;
		else
			for (const [idx, scheme] of currentScheme.entries()) {
				if (!isEqual(scheme, newScheme[idx])) return true;
			}
	} else return true;
	return false;
};
