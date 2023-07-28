import { RNodes } from "../../../types/custom-types";
import { reactProps } from "./props";

import App_v0_3_0 from "../../../reactNodes/organisms/App/App_v0.3.0";
import Auth_v0_2_0 from "../../../reactNodes/organisms/auth/Auth_v0.2.0"
// data
import UseData_v0_1_1 from "../../../reactNodes/data/UseData/UseData_v0.1.1"
/* //import UseSearch_v0_1_0 from "../../../reactNodes/data/useSearch/UseSearch_v0.1.0"
import UseSearch_v0_1_1 from "../../../reactNodes/data/UseSearch/UseSearch_v0.1.1"
// organisms
import AppShell_v0_1_0 from "../../../reactNodes/organisms/appShell/AppShell_v0.1.0"
import Form_v0_1_0 from '../../../reactNodes/organisms/Form/Form_v0.1.0'
import Table_v0_1_0 from "../../../reactNodes/organisms/Table/Table_v0.1.0"
import Table_v0_2_0 from "../../../reactNodes/organisms/Table/Table_v0.2.0"
import ETable_v0_1_0 from "../../../reactNodes/organisms/ETable/ETable_v0.1.0"
import ETable_v0_1_1 from "../../../reactNodes/organisms/ETable/ETable_v0.1.1"
// molecules
import Center_v0_1_0 from "../../../reactNodes/molecules/center/Center_v0.1.0"
import Drawer_v0_1_0 from "../../../reactNodes/molecules/drawer/Drawer_v0.1.0"
import Modal_v0_1_0 from "../../../reactNodes/molecules/Modal/Modal_v0.1.0"
import Flex_v0_1_0 from "../../../reactNodes/molecules/flex/Flex_v0.1.0"
import Grid_v0_1_0 from "../../../reactNodes/molecules/grid/Grid_v0.1.0"
import Group_v0_1_0 from "../../../reactNodes/molecules/group/Group_v0.1.0"
import Group_v0_2_0 from "../../../reactNodes/molecules/Group/Group_v0.2.0"
import Paper_v0_1_0 from "../../../reactNodes/molecules/paper/Paper_v0.1.0"
import PaperButton_v0_1_0 from "../../../reactNodes/molecules/PaperButton/PaperButton_v0.1.0"
import ScrollArea_v0_1_0 from "../../../reactNodes/molecules/ScrollArea/ScrollArea_v0.1.0"
import Stack_v0_1_0 from "../../../reactNodes/molecules/stack/Stack_v0.1.0"
import Carousel_v0_1_0 from "../../../reactNodes/molecules/Carousel/Carousel_v0.1.0"
///////////
// elements
// buttons
import ActionIcon_v0_1_0 from "../../../reactNodes/elements/buttons/ActionIcon/ActionIcon_v0.1.0"
import Button_v0_1_0 from "../../../reactNodes/elements/buttons/button/Button_v0.1.0"
import Button_v0_1_1 from "../../../reactNodes/elements/buttons/Button/Button_v0.1.1"
import PopoverButton_v0_1_0 from "../../../reactNodes/elements/buttons/PopoverButton/PopoverButton_v0.1.0"
// dataDisplay
import Avatar_v0_1_0 from "../../../reactNodes/elements/dataDisplay/Avatar/Avatar_v0.1.0"
import Badge_v0_1_0 from "../../../reactNodes/elements/DataDisplay/Badge/Badge_v0.1.0"
import Icon_v0_1_0 from "../../../reactNodes/elements/dataDisplay/Icon/Icon_v0.1.0"
import QRCode_v0_1_0 from "../../../reactNodes/elements/dataDisplay/QRCode/QRCode_v0.1.0"
import Image_v0_1_0 from "../../../reactNodes/elements/dataDisplay/Image/Image_v0.1.0"
// feedback
import Loader_v0_1_0 from "../../../reactNodes/elements/feedback/loader/Loader_v0.1.0"
// inputs
import CheckboxGroup_v0_1_0 from "../../../reactNodes/elements/inputs/CheckboxGroup/CheckboxGroup_v0.1.0"
import SegmentedControl_v0_1_0 from "../../../reactNodes/elements/inputs/SegmentedControl/SegmentedControl_v0.1.0"
import Select_v0_1_0 from "../../../reactNodes/elements/inputs/Select/Select_v0.1.0"
import Select_v0_2_0 from "../../../reactNodes/elements/inputs/Select/Select_v0.2.0"
import MultiSelect_v0_1_0 from "../../../reactNodes/elements/inputs/MultiSelect/MultiSelect_v0.1.0"
import TextInput_v0_1_0 from "../../../reactNodes/elements/inputs/TextInput/TextInput_v0.1.0"
import TextInput_v0_2_0 from "../../../reactNodes/elements/inputs/TextInput/TextInput_v0.2.0"
import Textarea_v0_1_0 from "../../../reactNodes/elements/inputs/Textarea/Textarea_v0.1.0"
import DateTimePicker_v0_1_0 from "../../../reactNodes/elements/inputs/DateTimePicker/DateTimePicker_v0.1.0"
// miscellaneous
import WebCamera_v0_1_0 from "../../../reactNodes/elements/miscellaneous/WebCamera/WebCamera_v0.1.0"
// typography
import Text_v0_2_1 from "../../../reactNodes/elements/typography/Text/Text_v0.2.1" */


const reactNodes: RNodes = {
    App: {
        '0.3.0': {
            Node: App_v0_3_0,
            allowChildren: true,
            //reqiereChildren: false,
            inputs: (({ dbClasses, notificationsPosition }) => ({ dbClasses, notificationsPosition }))({ ...reactProps }),
            outputs: (({ sendInited }) => ({ sendInited }))({ ...reactProps }),
            portsToCheck: ['dbClasses']
        },
    },
    Auth: {
        '0.2.0': {
            Node: Auth_v0_2_0,
            inputs: (({ m, mt, mr, mb, ml, p, pt, pr, pb, pl, w, h, shadow, stackSpacing, buttonColor }) =>
                ({ m, mt, mr, mb, ml, p, pt, pr, pb, pl, w, h, shadow, stackSpacing, buttonColor }))({ ...reactProps }),
            outputs: (({ authenticated }) => ({ authenticated }))({ ...reactProps }),
        },
    },
    // data
    useData: {
        '0.1.1': {
            Node: UseData_v0_1_1,
            inputs: (({ useDataType, useDataEnabled, className, setRefs, refMap, query, sorts, options, id, ids }) =>
                ({ useDataType, useDataEnabled, className, setRefs, refMap, query, sorts, options, id, ids }))({ ...reactProps }),
            outputs: (({ isLoading, sendLoaded }) => ({ isLoading, sendLoaded }))({ ...reactProps }),
            portRules: [
                { condition: 'setRefs = true', inputs: ['refMap'] },
                { condition: 'useDataType = fetch', inputs: ['query', 'sorts', 'options'] },
                { condition: 'useDataType = get', inputs: ['id'] },
                { condition: 'useDataType = mGet', inputs: ['ids'] },
            ]
        },
    },
    /*   useSearch: { versions: { '0.1.0': UseSearch_v0_1_0, } },
     UseSearch: { versions: { '0.1.1': UseSearch_v0_1_1, } },
     // organisms
     AppShell: { allowChildren: true, versions: { '0.1.0': AppShell_v0_1_0, } },
     Form: { allowChildren: true, versions: { '0.1.0': Form_v0_1_0, } },
     Table: { versions: { '0.1.0': Table_v0_1_0, '0.2.0': Table_v0_2_0, } },
     ETable: { versions: { '0.1.0': ETable_v0_1_0, '0.1.1': ETable_v0_1_1, } },
     // molecules    
     center: { allowChildren: true, versions: { '0.1.0': Center_v0_1_0, } },
     drawer: { allowChildren: true, versions: { '0.1.0': Drawer_v0_1_0, } },
     Modal: { allowChildren: true, versions: { '0.1.0': Modal_v0_1_0, } },
     flex: { allowChildren: true, versions: { '0.1.0': Flex_v0_1_0, } },
     grid: { allowChildren: true, versions: { '0.1.0': Grid_v0_1_0, } },
     group: { allowChildren: true, versions: { '0.1.0': Group_v0_1_0, } },
     Group: { allowChildren: true, versions: { '0.2.0': Group_v0_2_0, } },
     paper: { allowChildren: true, versions: { '0.1.0': Paper_v0_1_0, } },
     paperButton: { allowChildren: true, versions: { '0.1.0': PaperButton_v0_1_0, } },
     scrollArea: { allowChildren: true, versions: { '0.1.0': ScrollArea_v0_1_0, } },
     stack: { allowChildren: true, versions: { '0.1.0': Stack_v0_1_0, } },
     Carousel: { allowChildren: true, versions: { '0.1.0': Carousel_v0_1_0, } },
     ///////////
     // elements
     // buttons
     actionIcon: { versions: { '0.1.0': ActionIcon_v0_1_0, } },
     button: { versions: { '0.1.0': Button_v0_1_0 } },
     Button: { versions: { '0.1.1': Button_v0_1_1, } },
     PopoverButton: { versions: { '0.1.0': PopoverButton_v0_1_0, } },
     // dataDisplay
     avatar: { allowChildren: true, versions: { '0.1.0': Avatar_v0_1_0, } },
     Badge: { versions: { '0.1.0': Badge_v0_1_0, } },
     icon: { versions: { '0.1.0': Icon_v0_1_0, } },
     QRCode: { versions: { '0.1.0': QRCode_v0_1_0, } },
     Image: { versions: { '0.1.0': Image_v0_1_0, } },
     // feedback
     loader: { versions: { '0.1.0': Loader_v0_1_0, } },
     // inputs
     CheckboxGroup: { versions: { '0.1.0': CheckboxGroup_v0_1_0, } },
     SegmentedControl: { versions: { '0.1.0': SegmentedControl_v0_1_0, } },
     Select: { versions: { '0.1.0': Select_v0_1_0, '0.2.0': Select_v0_2_0, } },
     MultiSelect: { versions: { '0.1.0': MultiSelect_v0_1_0, } },
     textInput: { versions: { '0.1.0': TextInput_v0_1_0 } },
     TextInput: { versions: { '0.2.0': TextInput_v0_2_0, } },
     Textarea: { versions: { '0.1.0': Textarea_v0_1_0 } },
     DateTimePicker: { versions: { '0.1.0': DateTimePicker_v0_1_0, } },
     // miscellaneous
     webCamera: { versions: { '0.1.0': WebCamera_v0_1_0, } },
     // typography
     text: { versions: { '0.2.1': Text_v0_2_1, } }, */
}

export default reactNodes