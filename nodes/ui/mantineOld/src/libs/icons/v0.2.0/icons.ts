import {
    IconUser, IconHome, IconChevronLeft, IconChevronRight, IconChevronDown, IconEdit, IconSearch, IconCalendarEvent, IconListDetails, IconChartBar,
    IconIroning3, IconTrash, IconCheck, IconPlus, IconDeviceFloppy, IconBuildingCommunity, IconGhostFilled, IconPointFilled, IconPhoto,
    IconDatabaseOff, IconAdjustmentsHorizontal, IconLogout, IconChartAreaFilled, IconCoins, IconLock, IconFileSpreadsheet, IconCurrencyRubel,
    IconArrowRight, IconFolder, IconPencil, IconLogout2, IconRefresh, IconWand, IconBrush, IconFileTypeXls, IconInfoCircle, IconArchive,
    IconBriefcase2, IconX, IconDownload, IconChevronUp, IconThumbUp, IconThumbDown, IconCircleCheck, IconReportAnalytics, IconRepeat,
    IconSquareNumber1, IconUrgent, IconUsers, IconQrcode, IconMinus, IconSwitchVertical, IconHelp, IconFolderPlus, IconClipboard,
    IconCubePlus, IconLayersSubtract, IconKey, IconSend, IconArrowLeft, IconArrowBackUp, IconArrowUp, IconArrowsVertical, Icon, IconPrinter,
    IconRobot, IconSun, IconMoon, IconCaretRight, IconCamera,
} from '@tabler/icons-react'

export default function icons(iconName: string) {
    const icons: { [key: string]: any } = {
        IconUser, IconHome, IconChevronLeft, IconChevronRight, IconChevronDown, IconEdit, IconSearch, IconCalendarEvent, IconListDetails, IconChartBar,
        IconIroning3, IconTrash, IconCheck, IconPlus, IconDeviceFloppy, IconBuildingCommunity, IconGhostFilled, IconPointFilled, IconPhoto,
        IconDatabaseOff, IconAdjustmentsHorizontal, IconLogout, IconChartAreaFilled, IconCoins, IconLock, IconFileSpreadsheet, IconCurrencyRubel,
        IconArrowRight, IconFolder, IconPencil, IconLogout2, IconRefresh, IconWand, IconBrush, IconFileTypeXls, IconInfoCircle, IconArchive,
        IconBriefcase2, IconX, IconDownload, IconChevronUp, IconThumbUp, IconThumbDown, IconCircleCheck, IconReportAnalytics, IconRepeat,
        IconSquareNumber1, IconUrgent, IconUsers, IconQrcode, IconMinus, IconSwitchVertical, IconHelp, IconFolderPlus, IconClipboard,
        IconCubePlus, IconLayersSubtract, IconKey, IconSend, IconArrowLeft, IconArrowBackUp, IconArrowUp, IconArrowsVertical, IconPrinter,
        IconRobot, IconSun, IconMoon, IconCaretRight, IconCamera,
    }
    return icons[iconName] as Icon
}