import getValue8 from '@packages/get-value-v0.8.0';
import getMasked2 from '@packages/get-masked-v0.2.0';
import getFormatedDate2 from '@packages/get-formated-date-v0.2.0';
import isEmpty from '@packages/is-empty-v0.1.0';

const utils = {
	getValue: { v8: getValue8 },
	getFormatedDate: { v2: getFormatedDate2 },
	getMasked: { v2: getMasked2 },
	isEmpty: { v1: isEmpty }
};

export default utils;
