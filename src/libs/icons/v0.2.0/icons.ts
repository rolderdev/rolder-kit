import {
    IconUser, IconHome, IconChevronLeft, IconChevronRight, IconChevronDown, IconEdit, IconSearch, IconCalendarEvent, IconListDetails, IconChartBar,
    IconIroning3, IconTrash, IconCheck, IconPlus, IconDeviceFloppy, IconBuildingCommunity, IconGhostFilled, IconPointFilled, IconPhoto,
    IconDatabaseOff, IconAdjustmentsHorizontal, IconLogout,
} from '@tabler/icons-react'

export default function icons(iconName: string) {
    const icons: { [key: string]: any } = {
        IconUser, IconHome, IconChevronLeft, IconChevronRight, IconChevronDown, IconEdit, IconSearch, IconCalendarEvent, IconListDetails, IconChartBar,
        IconIroning3, IconTrash, IconCheck, IconPlus, IconDeviceFloppy, IconBuildingCommunity, IconGhostFilled, IconPointFilled, IconPhoto,
        IconDatabaseOff, IconAdjustmentsHorizontal, IconLogout,
    }
    return icons[iconName]
}