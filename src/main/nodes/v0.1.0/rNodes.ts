// data
import UseDataNodes from "../../../rNodes/data/UseData/UseDataNodes";
import UseDataNode_v1 from "../../../rNodes/data/UseData/v1/UseDataNode";
import UseSearchNodes from "../../../rNodes/data/UseSearch/UseSearchNodes";
// organisms
import AppNodes from "../../../rNodes/organisms/App/AppNodes";
import AppNode_v1 from "../../../rNodes/organisms/App/v1/AppNode";
import AuthNodes from "../../../rNodes/organisms/Auth/AuthNodes";
import AuthNode_v0 from "../../../rNodes/organisms/Auth/v0/AuthNode";
import AppShellNodes from "../../../rNodes/organisms/AppShell/AppShellNodes";
import TableNodes from "../../../rNodes/organisms/Table/TableNodes";
import TableNode_v1 from "../../../rNodes/organisms/Table/v1/TableNode";
import ETableNodes from "../../../rNodes/organisms/ETable/ETableNodes";
import FormNodes from "../../../rNodes/organisms/Form/FormNodes";
import FormNode_V0 from "../../../rNodes/organisms/Form/v0/FormNode";
// molecules
import StackNodes from "../../../rNodes/molecules/Stack/StackNodes";
import GroupNodes from "../../../rNodes/molecules/Group/GroupNodes";
import CenterNodes from "../../../rNodes/molecules/Center/CenterNodes";
import ScrollAreaNodes from "../../../rNodes/molecules/ScrollArea/ScrollAreaNodes";
import DrawerNodes from "../../../rNodes/molecules/Drawer/DrawerNodes";
import DrawerNode_v0 from "../../../rNodes/molecules/Drawer/v0/DrawerNode";
import DrawerNode_v1 from "../../../rNodes/molecules/Drawer/v1/DrawerNode";
import CarouselNodes from "../../../rNodes/molecules/Carousel/CarouselNodes";
import ModalNodes from "../../../rNodes/molecules/Modal/ModalNodes";
import ModalNode_v0 from "../../../rNodes/molecules/Modal/v0/ModalNode";
import GridNodes from "../../../rNodes/molecules/Grid/GridNodes";
import PaperNodes from "../../../rNodes/molecules/Paper/PaperNodes";
import UnstyledButtonNodes from "../../../rNodes/molecules/UnstyledButton/UnstyledButtonNodes";
// elements
// buttons
import ActionIconNodes from "../../../rNodes/elements/buttons/ActionIcon/ActionIconNodes";
import ButtonNodes from "../../../rNodes/elements/buttons/Button/ButtonNodes";
import ButtonNode_v0 from "../../../rNodes/elements/buttons/Button/v0/ButtonNode";
import PopoverActionIconNodes from "../../../rNodes/elements/buttons/PopoverActionIcon/PopoverActionIconNodes";
import PopoverButtonNode_v0 from "../../../rNodes/elements/buttons/PopoverButton/v0/PopoverButtonNode";
// dataDisplay
import AvatarNodes from "../../../rNodes/elements/dataDisplay/Avatar/AvatarNodes";
import IconNodes from "../../../rNodes/elements/dataDisplay/Icon/Icon";
import BadgeNodes from "../../../rNodes/elements/dataDisplay/Badge/BadgeNodes";
import ImageNodes from "../../../rNodes/elements/dataDisplay/Image/ImageNodes";
import QRCodeNodes from "../../../rNodes/elements/dataDisplay/QRCode/QRCodeNodes";
// feedback
import LoaderNodes from "../../../rNodes/elements/feedback/Loader/LoaderNodes";
import IndicatorNodes from "../../../rNodes/elements/feedback/Indicator/IndicatorNodes";
// inputs
import SegmentedControlNodes from "../../../rNodes/elements/inputs/SegmentedControl/SegmentedControlNodes";
import CheckboxGroupNodes from "../../../rNodes/elements/inputs/CheckboxGroup/CheckboxGroupNodes";
import DatePickerInputNodes from "../../../rNodes/elements/inputs/DatePickerInput/DatePickerInput";
import DateTimePickerNodes from "../../../rNodes/elements/inputs/DateTimePicker/DateTimePickerNodes";
import MultiSelectNodes from "../../../rNodes/elements/inputs/MultiSelect/MultiSelectNodes";
import SelectNodes from "../../../rNodes/elements/inputs/Select/SelectNodes";
import TextareaNodes from "../../../rNodes/elements/inputs/Textarea/TextareaNodes";
import TextInputNodes from "../../../rNodes/elements/inputs/TextInput/TextInputNodes";
import TextInputNode_v0 from "../../../rNodes/elements/inputs/TextInput/v0/TextInputNode";
import CheckboxNode_v0 from "../../../rNodes/elements/inputs/Checkbox/v0/CheckboxNode";
import MaskedInputNode_v0 from "../../../rNodes/elements/inputs/MaskedInput/v0/MaskedInputNode";
// miscellaneous
import WebCameraNodes from "../../../rNodes/elements/miscellaneous/WebCamera/WebCameraNodes";
import QRScannerNodes from "../../../rNodes/elements/miscellaneous/QRScanner/QRScannerNodes";
import DividerNode_v0 from "../../../rNodes/elements/miscellaneous/Divider/v0/DividerNode";
// typography
import TextNodes from "../../../rNodes/elements/typography/Text/TextNodes";
import TextNode_v1 from "../../../rNodes/elements/typography/Text/v1/TextNode";
import TitleNode_v0 from "../../../rNodes/elements/typography/Title/v0/TitleNode";

const reactNodes: any = [
    // data
    ...UseDataNodes, UseDataNode_v1, ...UseSearchNodes,
    // organisms
    ...AppNodes, AppNode_v1, ...AuthNodes, AuthNode_v0, ...AppShellNodes, ...TableNodes, TableNode_v1, ...ETableNodes, ...FormNodes, FormNode_V0,
    // molecules
    ...StackNodes, ...GroupNodes, ...CenterNodes, ...ScrollAreaNodes, ...DrawerNodes, DrawerNode_v0, DrawerNode_v1, ...CarouselNodes, ...ModalNodes,
    ModalNode_v0, ...GridNodes, ...PaperNodes, ...UnstyledButtonNodes,
    // elements
    // buttons
    ...ActionIconNodes, ...ButtonNodes, ButtonNode_v0, ...PopoverActionIconNodes, PopoverButtonNode_v0,
    // dataDisplay
    ...AvatarNodes, ...IconNodes, ...BadgeNodes, ...ImageNodes, ...QRCodeNodes,
    // feedback
    ...LoaderNodes, ...IndicatorNodes,
    // inputs
    ...SegmentedControlNodes, ...CheckboxGroupNodes, CheckboxNode_v0, ...DatePickerInputNodes, ...DateTimePickerNodes, ...MultiSelectNodes,
    ...SelectNodes, ...TextareaNodes, ...TextInputNodes, TextInputNode_v0, MaskedInputNode_v0,
    // miscellaneous
    ...WebCameraNodes, ...QRScannerNodes, DividerNode_v0,
    // typography
    ...TextNodes, TextNode_v1, TitleNode_v0
]

export default reactNodes