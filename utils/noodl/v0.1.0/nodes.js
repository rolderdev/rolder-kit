import props from "./props/props"

export function portsDefinition(nodeName, version) {
    return {
        ins: props[nodeName]?.[version]?.ins,
        outs: props[nodeName]?.[version]?.outs,
        dyn: props[nodeName]?.[version]?.dyn,
    }
}

import App_v0_2_0 from "../../../react-nodes/organisms/app/App_v0.2.0"
import Auth_v0_1_0 from "../../../react-nodes/organisms/auth/Auth_v0.1.0"
// data
import UseData_v0_1_1 from "../../../react-nodes/data/UseData/UseData_v0.1.1"
import UseSearch_v0_1_0 from "../../../react-nodes/data/useSearch/UseSearch_v0.1.0"
import UseSearch_v0_1_1 from "../../../react-nodes/data/UseSearch/UseSearch_v0.1.1"
// organisms
import AppShell_v0_1_0 from "../../../react-nodes/organisms/appShell/AppShell_v0.1.0"
import Form_v0_1_0 from '../../../react-nodes/organisms/Form/Form_v0.1.0'
import Table_v0_1_0 from "../../../react-nodes/organisms/Table/Table_v0.1.0"
import Table_v0_2_0 from "../../../react-nodes/organisms/Table/Table_v0.2.0"
import ETable_v0_1_0 from "../../../react-nodes/organisms/ETable/ETable_v0.1.0"
// molecules
import Center_v0_1_0 from "../../../react-nodes/molecules/center/Center_v0.1.0"
import Drawer_v0_1_0 from "../../../react-nodes/molecules/drawer/Drawer_v0.1.0"
import Flex_v0_1_0 from "../../../react-nodes/molecules/flex/Flex_v0.1.0"
import Grid_v0_1_0 from "../../../react-nodes/molecules/grid/Grid_v0.1.0"
import Group_v0_1_0 from "../../../react-nodes/molecules/group/Group_v0.1.0"
import Group_v0_2_0 from "../../../react-nodes/molecules/Group/Group_v0.2.0"
import Paper_v0_1_0 from "../../../react-nodes/molecules/paper/Paper_v0.1.0"
import PaperButton_v0_1_0 from "../../../react-nodes/molecules/PaperButton/PaperButton_v0.1.0"
import ScrollArea_v0_1_0 from "../../../react-nodes/molecules/ScrollArea/ScrollArea_v0.1.0"
import Stack_v0_1_0 from "../../../react-nodes/molecules/stack/Stack_v0.1.0"
import Carousel_v0_1_0 from "../../../react-nodes/molecules/Carousel/Carousel_v0.1.0"
///////////
// elements
// buttons
import ActionIcon_v0_1_0 from "../../../react-nodes/elements/buttons/ActionIcon/ActionIcon_v0.1.0"
import Button_v0_1_0 from "../../../react-nodes/elements/buttons/button/Button_v0.1.0"
import Button_v0_1_1 from "../../../react-nodes/elements/buttons/Button/Button_v0.1.1"
import PopoverButton_v0_1_0 from "../../../react-nodes/elements/buttons/PopoverButton/PopoverButton_v0.1.0"
// dataDisplay
import Avatar_v0_1_0 from "../../../react-nodes/elements/dataDisplay/Avatar/Avatar_v0.1.0"
import Badge_v0_1_0 from "../../../react-nodes/elements/DataDisplay/Badge/Badge_v0.1.0"
import Icon_v0_1_0 from "../../../react-nodes/elements/dataDisplay/Icon/Icon_v0.1.0"
// feedback
import Loader_v0_1_0 from "../../../react-nodes/elements/feedback/loader/Loader_v0.1.0"
// inputs
import CheckboxGroup_v0_1_0 from "../../../react-nodes/elements/inputs/CheckboxGroup/CheckboxGroup_v0.1.0"
import SegmentedControl_v0_1_0 from "../../../react-nodes/elements/inputs/SegmentedControl/SegmentedControl_v0.1.0"
import Select_v0_1_0 from "../../../react-nodes/elements/inputs/Select/Select_v0.1.0"
import Select_v0_2_0 from "../../../react-nodes/elements/inputs/Select/Select_v0.2.0"
import MultiSelect_v0_1_0 from "../../../react-nodes/elements/inputs/MultiSelect/MultiSelect_v0.1.0"
import TextInput_v0_1_0 from "../../../react-nodes/elements/inputs/TextInput/TextInput_v0.1.0"
import TextInput_v0_2_0 from "../../../react-nodes/elements/inputs/TextInput/TextInput_v0.2.0"
import Textarea_v0_1_0 from "../../../react-nodes/elements/inputs/Textarea/Textarea_v0.1.0"
import DateTimePicker_v0_1_0 from "../../../react-nodes/elements/inputs/DateTimePicker/DateTimePicker_v0.1.0"
// miscellaneous
import WebCamera_v0_1_0 from "../../../react-nodes/elements/miscellaneous/WebCamera/WebCamera_v0.1.0"
// typography
import Text_v0_2_1 from "../../../react-nodes/elements/typography/Text/Text_v0.2.1"

const reactNodes = {
    App: { allowChildren: true, versions: { '0.2.0': App_v0_2_0, } },
    auth: { versions: { '0.1.0': Auth_v0_1_0, } },
    // data
    useData: { versions: { '0.1.1': UseData_v0_1_1, } },
    useSearch: { versions: { '0.1.0': UseSearch_v0_1_0, } },
    UseSearch: { versions: { '0.1.1': UseSearch_v0_1_1, } },
    // organisms
    AppShell: { allowChildren: true, versions: { '0.1.0': AppShell_v0_1_0, } },
    Form: { allowChildren: true, versions: { '0.1.0': Form_v0_1_0, } },
    Table: { versions: { '0.1.0': Table_v0_1_0, '0.2.0': Table_v0_2_0, } },
    ETable: { versions: { '0.1.0': ETable_v0_1_0, } },
    // molecules    
    center: { allowChildren: true, versions: { '0.1.0': Center_v0_1_0, } },
    drawer: { allowChildren: true, versions: { '0.1.0': Drawer_v0_1_0, } },
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
    text: { versions: { '0.2.1': Text_v0_2_1, } },
}

const nodes = {
    initBackend: {
        name: 'initBackend',
        portsDefinition: (v) => v && portsDefinition('initBackend', v),
        nodeImport: async (v) => v && import('../../../nodes/initBackend/initBackend' + '_v' + v),
        versions: ['0.1.0'],
    },
    subscribe: {
        name: 'subscribe',
        portsDefinition: (v) => v && portsDefinition('subscribe', v),
        nodeImport: async (v) => v && import('../../../nodes/data/subscribe/subscribe' + '_v' + v),
        versions: ['0.1.0'],
    },
    create: {
        name: 'create',
        portsDefinition: (v) => v && portsDefinition('create', v),
        nodeImport: async (v) => v && import('../../../nodes/data/create/create' + '_v' + v),
        versions: ['0.1.0'],
    },
    update: {
        name: 'update',
        portsDefinition: (v) => v && portsDefinition('update', v),
        nodeImport: async (v) => v && import('../../../nodes/data/update/update' + '_v' + v),
        versions: ['0.1.0'],
    },
    mDelete: {
        name: 'mDelete',
        portsDefinition: (v) => v && portsDefinition('mDelete', v),
        nodeImport: async (v) => v && import('../../../nodes/data/mDelete/mDelete' + '_v' + v),
        versions: ['0.1.0'],
    },
    uploadWebCamShots: {
        name: 'uploadWebCamShots',
        portsDefinition: (v) => v && portsDefinition('uploadWebCamShots', v),
        nodeImport: async (v) => v && import('../../../nodes/data/uploadFiles/uploadWebCamShots' + '_v' + v),
        versions: ['0.1.0'],
    },
    notification: {
        name: 'notification',
        portsDefinition: (v) => v && portsDefinition('notification', v),
        nodeImport: async (v) => v && import('../../../nodes/notification/notification' + '_v' + v),
        versions: ['0.1.0'],
    },
}

export { reactNodes, oldReactNodes, nodes }