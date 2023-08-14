// data
import UseDataNodes from "../../../rNodes/data/UseData/UseDataNodes";
import UseSearchNodes from "../../../rNodes/data/UseSearch/UseSearchNodes";
// organisms
import AppNodes from "../../../rNodes/organisms/App/AppNodes";
import AuthNodes from "../../../rNodes/organisms/Auth/AuthNodes";
import AppShellNodes from "../../../rNodes/organisms/AppShell/AppShellNodes";
import TableNodes from "../../../rNodes/organisms/Table/TableNodes";
import ETableNodes from "../../../rNodes/organisms/ETable/ETableNodes";
import FormNodes from "../../../rNodes/organisms/Form/FormNodes";
// molecules
import StackNodes from "../../../rNodes/molecules/Stack/StackNodes";
import GroupNodes from "../../../rNodes/molecules/Group/GroupNodes";
import CenterNodes from "../../../rNodes/molecules/Center/CenterNodes";
import ScrollAreaNodes from "../../../rNodes/molecules/ScrollArea/ScrollAreaNodes";
import DrawerNodes from "../../../rNodes/molecules/Drawer/DrawerNodes";
import CarouselNodes from "../../../rNodes/molecules/Carousel/CarouselNodes";
import ModalNodes from "../../../rNodes/molecules/Modal/ModalNodes";
import GridNodes from "../../../rNodes/molecules/Grid/GridNodes";
import PaperNodes from "../../../rNodes/molecules/Paper/PaperNodes";
import UnstyledButtonNodes from "../../../rNodes/molecules/UnstyledButton/UnstyledButtonNodes";
// elements
// buttons
import ActionIconNodes from "../../../rNodes/elements/buttons/ActionIcon/ActionIconNodes";
import ButtonNodes from "../../../rNodes/elements/buttons/Button/ButtonNodes";
import PopoverActionIconNodes from "../../../rNodes/elements/buttons/PopoverActionIcon/PopoverActionIconNodes";
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
// miscellaneous
import WebCameraNodes from "../../../rNodes/elements/miscellaneous/WebCamera/WebCameraNodes";
import QRScannerNodes from "../../../rNodes/elements/miscellaneous/QRScanner/QRScannerNodes";
// typography
import TextNodes from "../../../rNodes/elements/typography/Text/TextNodes";

const reactNodes = [
    // data
    ...UseDataNodes, ...UseSearchNodes,
    // organisms
    ...AppNodes, ...AuthNodes, ...AppShellNodes, ...TableNodes, ...ETableNodes, ...FormNodes,
    // molecules
    ...StackNodes, ...GroupNodes, ...CenterNodes, ...ScrollAreaNodes, ...DrawerNodes, ...CarouselNodes, ...ModalNodes, ...GridNodes,
    ...PaperNodes, ...UnstyledButtonNodes,
    // elements
    // buttons
    ...ActionIconNodes, ...ButtonNodes, ...PopoverActionIconNodes,
    // dataDisplay
    ...AvatarNodes, ...IconNodes, ...BadgeNodes, ...ImageNodes, ...QRCodeNodes,
    // feedback
    ...LoaderNodes, ...IndicatorNodes,
    // inputs
    ...SegmentedControlNodes, ...CheckboxGroupNodes, ...DatePickerInputNodes, ...DateTimePickerNodes, ...MultiSelectNodes, ...SelectNodes,
    ...TextareaNodes, ...TextInputNodes,
    // miscellaneous
    ...WebCameraNodes, ...QRScannerNodes,
    // typography
    ...TextNodes
]

export default reactNodes