import { ActionIcon, Group } from "@mantine/core"
import type { TableProps } from "../../types"
import { IconChevronRight } from "@tabler/icons-react"

export function Expander(
    recordId: string,
    child: any,
    expandedRecordIds: string[], setExpandedRecordIds: React.Dispatch<React.SetStateAction<string[]>>,
    onRowClick: TableProps['onRowClick'],
    classes: any, cx: any,
    chevronIconProps: any, actionIconProps: any,
    allowMultiple?: boolean
) {
    return <Group spacing="xs" noWrap={true}>
        {onRowClick === 'expansion'
            ? <IconChevronRight
                size="1.2em"
                className={cx(classes.expandIcon, {
                    [classes.expandIconRotated]: expandedRecordIds.includes(recordId),
                })}
                {...chevronIconProps}
            />
            : <ActionIcon
                my={-8}
                onClick={(e) => {
                    e.stopPropagation()
                    setExpandedRecordIds(old => {
                        if (allowMultiple) {
                            if (old.includes(recordId)) return old.filter(i => i !== recordId)
                            else return [...old, recordId]
                        } else return old.includes(recordId) ? [] : [recordId]
                    })
                }}
                {...actionIconProps}
            >
                <IconChevronRight
                    size="1.2em"
                    className={cx(classes.expandIcon, {
                        [classes.expandIconRotated]: expandedRecordIds.includes(recordId),
                    })}
                    {...chevronIconProps}
                />
            </ActionIcon>}
        {child}
    </Group>
}
