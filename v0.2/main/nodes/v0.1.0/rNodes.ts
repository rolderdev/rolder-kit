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
// dataDisplay
import AvatarNodes from "../../../rNodes/elements/dataDisplay/Avatar/AvatarNodes";
import IconNodes from "../../../rNodes/elements/dataDisplay/Icon/Icon";
// feedback
import LoaderNodes from "../../../rNodes/elements/feedback/Loader/LoaderNodes";
// inputs
import SegmentedControlNodes from "../../../rNodes/elements/inputs/SegmentedControl/SegmentedControlNodes";
// typography
import TextNodes from "../../../rNodes/elements/typography/Text/TextNodes";

const reactNodes = [
    // data
    ...UseDataNodes, ...UseSearchNodes,
    // organisms
    ...AppNodes, ...AuthNodes, ...AppShellNodes, ...TableNodes, ...ETableNodes, ...FormNodes,
    // molecules
    ...StackNodes, ...GroupNodes, ...CenterNodes, ...ScrollAreaNodes, ...DrawerNodes, ...CarouselNodes, ...ModalNodes, ...GridNodes, ...PaperNodes, ...UnstyledButtonNodes,
    // elements
    // buttons
    ...ActionIconNodes, ...ButtonNodes,
    // dataDisplay
    ...AvatarNodes, ...IconNodes,
    // feedback
    ...LoaderNodes,
    // inputs
    ...SegmentedControlNodes,
    // typography
    ...TextNodes
]

export default reactNodes