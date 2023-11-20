import { ReactNode } from "react";
import { ColumnDef } from "../../../types/Column";
import { Avatar, Checkbox, Group, Skeleton } from "@mantine/core";
import { TableCompProps } from "../../../types/TableCompProps";
import { MRT_Row, MRT_TableInstance } from "mantine-react-table";
import Value from "../../../cell/Value";
import { useAtomValue, useSetAtom } from "jotai";
import useAction from "../../../actions/useAction";
import { getSelectedAtom, setSelectionAtom } from "../../../selection/multiSelection";
import icons from "../../../../../../../../../libs/icons/v0.2.0/icons";
import convertColor from "../../../../../../../../../utils/convertColor/v0.2.0/convertColor";

export default function (
    tableProps: TableCompProps, columnDef: ColumnDef, table: MRT_TableInstance<RItem>, row: MRT_Row<RItem>, renderedCellValue: ReactNode
) {
    const { noodlNode, multiSelectable, multiSelectCheckboxColor, tableLoading } = tableProps

    const selectedItems = useAtomValue(getSelectedAtom)
    const setSelection = useSetAtom(setSelectionAtom)

    const actions = columnDef.actions?.map(i => { return useAction(tableProps, i, row, columnDef.hoverableActions || false) })
    const position = columnDef.actionsOnly ? 'center' : actions?.length ? 'apart' : columnDef.cell?.align ? columnDef.cell.align : 'left'

    const defaultRender = <Skeleton visible={tableLoading}>
        <Group w={columnDef.size ? columnDef.size : undefined} position={position} noWrap>
            {!columnDef.actionsOnly &&
                <Group noWrap>
                    {multiSelectable && table._getColumnDefs()[0].header === columnDef.header && <Checkbox
                        color={multiSelectCheckboxColor}
                        checked={selectedItems[row.original.id]}
                        onChange={(e) => setSelection(noodlNode, table, row.original.id, e.currentTarget.checked)}
                        onClick={(e) => e.stopPropagation()}
                    />}
                    {Value(columnDef, renderedCellValue)}
                </Group>}
            {actions?.length && <Group position='right' noWrap>{actions}</Group>}
        </Group>
    </Skeleton>

    function Icon(props: any) {
        const Icon = props.name && icons(props.name)
        return Icon ? <Icon
            size={props.size}
            stroke={props.stroke}
            color={convertColor(props.color)}
        /> : <></>
    }

    const render = columnDef.render && columnDef.render(row)
    if (render) switch (render.comp) {
        case 'Avatar': return <Group w={columnDef.size ? columnDef.size : undefined} position={position} noWrap>
            <Avatar {...render.props}>{Value(columnDef, renderedCellValue)}</Avatar>
        </Group>
        case 'Icon': return <Group w={columnDef.size ? columnDef.size : undefined} position={position} noWrap>
            <Icon {...render.props} />
        </Group>
        case 'Icons': return <Group w={columnDef.size ? columnDef.size : undefined} position={position} noWrap>
            {render.props.map((props: any) => <Icon {...props} />)}
        </Group>
        default: return defaultRender
    } else return defaultRender
}