import getValue6 from './getValue/6/getValue'
import getValue7 from './getValue/7/getValue'
import getValue8 from './getValue/8/getValue'
import getFormatedDate2 from './getFormatedDate/2/getFormatedDate'
import getMasked2 from './getMasked/2/getMasked'
import filterBy3 from './filterBy/3/filterBy'
import convertColor from '../mantine/utils/convertColor/v0.2.0/convertColor'

window.R.utils = {
    getValue: {
        v6: getValue6,
        v7: getValue7,
        v8: getValue8
    },
    getFormatedDate: { v2: getFormatedDate2 },
    getMasked: { v2: getMasked2 },
    filterBy: { v3: filterBy3 },
    convertColor: { v2: convertColor }
}