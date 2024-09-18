import getValue8 from '@shared/get-value-v0.8.0';
import getMasked2 from '@shared/get-masked-v0.2.0';
import getFormatedDate2 from '@shared/get-formated-date-v0.2.0';
import isEmpty from '@shared/is-empty-v0.1.0';
import naturalSort from '@shared/natural-sort-v0.1.0';

const utils = {
	getValue: { v8: getValue8 },
	getFormatedDate: { v2: getFormatedDate2 },
	getMasked: { v2: getMasked2 },
	isEmpty: { v1: isEmpty },
	naturalSort: { v1: naturalSort },
};

export default utils;
