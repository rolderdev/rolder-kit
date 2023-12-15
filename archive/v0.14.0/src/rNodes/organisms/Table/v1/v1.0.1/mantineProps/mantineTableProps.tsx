import { MRT_TableOptions } from "mantine-react-table";

export default function mantineTableProps(props: {
    highlightOnHover: boolean, withColumnBorders: boolean,
}): MRT_TableOptions['mantineTableProps'] {
    const { highlightOnHover, withColumnBorders } = props
    return {
        highlightOnHover,
        withColumnBorders,
        sx: { '& tbody tr:last-of-type td': { borderBottom: 'none' } }
    }
}