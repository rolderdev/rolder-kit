export const iconNames = [
    'IconUser', 'IconHome', 'IconChevronLeft', 'IconChevronRight', 'IconChevronDown', 'IconEdit', 'IconSearch',
    'IconCalendarEvent', 'IconListDetails', 'IconIroning3', 'IconTrash', 'IconCheck', 'IconPlus', 'IconDeviceFloppy',
    'IconBuildingCommunity', 'IconGhostFilled', 'IconPointFilled', 'IconPhoto', 'IconDatabaseOff', 'IconAdjustmentsHorizontal',
    'IconLogout', 'IconChartAreaFilled', 'IconCoins', 'IconLock', 'IconFileSpreadsheet', 'IconCurrencyRubel',
    'IconArrowRight', 'IconFolder', 'IconPencil', 'IconLogout2', 'IconRefresh', 'IconWand', 'IconBrush', 'IconFileTypeXls',
    'IconInfoCircle', 'IconArchive', 'IconBriefcase2', 'IconX', 'IconDownload', 'IconChevronUp', 'IconThumbUp', 'IconThumbDown',
    'IconCircleCheck', 'IconReportAnalytics', 'IconRepeat', 'IconSquareNumber1', 'IconUrgent', 'IconUsers', 'IconQrcode',
    'IconMinus', 'IconSwitchVertical', 'IconHelp', 'IconFolderPlus', 'IconClipboard', 'IconCubePlus', 'IconLayersSubtract',
    'IconKey', 'IconSend', 'IconArrowLeft', 'IconArrowBackUp', 'IconArrowUp', 'IconArrowsVertical', 'IconPrinter', 'IconRobot',
    'IconSun', 'IconMoon', 'IconChartBar'
]

export const hasIcon = (name: string) => {
  if (iconNames.includes(name)) return true
  else return false
}