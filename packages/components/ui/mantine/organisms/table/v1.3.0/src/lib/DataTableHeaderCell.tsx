import {
  ActionIcon,
  Box,
  Center,
  Checkbox,
  Flex,
  Group,
  Popover,
  Stack,
  createStyles,
  getStylesRef,
  type MantineTheme,
  type Sx,
} from '@mantine/core';
import { IconArrowUp, IconArrowsVertical, IconGripVertical, IconX } from '@tabler/icons-react';
import { useRef, useState, type BaseSyntheticEvent, type CSSProperties, type ReactNode } from 'react';
import { useDataTableDragToggleColumnsContext } from './DataTableDragToggleColumns.context';
import DataTableHeaderCellFilter from './DataTableHeaderCellFilter';
import { DataTableResizableHeaderHandle } from './DataTableResizableHeaderHandle';
import { DataTableColumnToggle } from './hooks';
import type { DataTableColumn, DataTableSortProps } from './types';
import { humanize, useMediaQueryStringOrFunction } from './utils';

const useStyles = createStyles((theme) => ({
  sortableColumnHeader: {
    cursor: 'pointer',
    transition: 'background .15s ease',
    '&:hover:not(:has(button:hover))': {
      background: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    },
  },
  draggableColumnHeader: {
    cursor: 'grab',
    borderRadius: 6,
    transition: 'all 0.2s',
    '&:active': {
      cursor: 'grabbing',
    },
    '&:hover:not(:has(button:hover))': {
      background: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[2],
    },
  },
  draggableColumnHeaderIcon: {
    cursor: 'inherit',
    margin: '-2px 2px 0',
  },
  draggableColumnHeaderOver: {
    background: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[2],
  },
  toggleableColumnHeaderIcon: {
    ref: getStylesRef('toggleableColumnHeaderIcon'),
    transition: 'opacity 0.2s',
    opacity: '0.1',
  },
  toggleableColumnHeader: {
    '&:hover': {
      [`& .${getStylesRef('toggleableColumnHeaderIcon')}`]: {
        opacity: 1,
      },
    },
  },
  resizableColumnHeader: {
    position: 'relative',
  },
  resizableColumnHeaderKnob: {
    position: 'relative',
  },
  sortableColumnHeaderGroup: {
    gap: '0.25em',
  },
  columnHeaderText: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  sortableColumnHeaderText: {
    minWidth: 0,
    flexGrow: 1,
  },
  sortableColumnHeaderIcon: {
    transition: 'transform .15s ease',
  },
  sortableColumnHeaderIconRotated: {
    transform: 'rotate3d(0, 0, 1, 180deg)',
  },
  sortableColumnHeaderUnsortedIcon: {
    color: theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[5],
    transition: 'color .15s ease',
    'th:hover &': {
      color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
    },
  },
}));

type DataTableHeaderCellProps<T> = {
  className?: string;
  sx?: Sx;
  style?: CSSProperties;
  visibleMediaQuery: string | ((theme: MantineTheme) => string) | undefined;
  title: ReactNode | undefined;
  sortStatus: DataTableSortProps['sortStatus'];
  sortIcons: DataTableSortProps['sortIcons'];
  onSortStatusChange: DataTableSortProps['onSortStatusChange'];
  allColumns: DataTableColumn<T>[];
} & Pick<
  DataTableColumn<T>,
  | 'accessor'
  | 'sortable'
  | 'draggable'
  | 'toggleable'
  | 'resizable'
  | 'textAlignment'
  | 'width'
  | 'filter'
  | 'filtering'
>;

export default function DataTableHeaderCell<T>({
  className,
  sx,
  style,
  accessor,
  visibleMediaQuery,
  title,
  sortable,
  draggable,
  toggleable,
  resizable,
  sortIcons,
  textAlignment,
  width,
  sortStatus,
  onSortStatusChange,
  filter,
  filtering,
  allColumns,
}: DataTableHeaderCellProps<T>) {
  const { setSourceColumn, setTargetColumn, swapColumns, columnsToggle, setColumnsToggle } =
    useDataTableDragToggleColumnsContext();

  const [dragOver, setDragOver] = useState<boolean>(false);

  const columnRef = useRef<HTMLTableCellElement | null>(null);

  const [columnsPopoverOpened, setColumnsPopoverOpened] = useState<boolean>(false);

  const { cx, classes } = useStyles();

  if (!useMediaQueryStringOrFunction(visibleMediaQuery)) return null;

  const text = title ?? humanize(accessor);

  const tooltip = typeof text === 'string' ? text : undefined;

  const sortAction =
    sortable && onSortStatusChange
      ? (e?: BaseSyntheticEvent) => {
          if (e?.defaultPrevented) return;

          onSortStatusChange({
            columnAccessor: accessor,
            direction:
              sortStatus?.columnAccessor === accessor
                ? sortStatus.direction === 'asc'
                  ? 'desc'
                  : 'asc'
                : sortStatus?.direction ?? 'asc',
          });
        }
      : undefined;

  const handleColumnDragStart = (e: React.DragEvent) => {
    e.stopPropagation();
    setSourceColumn(accessor as string);
    setDragOver(false);
  };

  const handleColumnDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setTargetColumn(accessor as string);
    setDragOver(true);
  };

  const handleColumnDrop = () => {
    setTargetColumn(accessor as string);
    setDragOver(false);
    swapColumns();
  };

  const handleColumnDragEnter = () => {
    setDragOver(true);
  };

  const handleColumnDragLeave = () => {
    setDragOver(false);
  };

  const handleColumnToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    setColumnsToggle((columnsToggle) =>
      columnsToggle.map((c) => {
        if (c.accessor === accessor) {
          return { ...c, toggled: false };
        }
        return c;
      })
    );
  };

  return (
    <Box
      component="th"
      className={cx(
        {
          [classes.sortableColumnHeader]: sortable,
          [classes.toggleableColumnHeader]: toggleable,
          [classes.resizableColumnHeader]: resizable,
        },
        className
      )}
      sx={[
        {
          '&&': { textAlign: textAlignment },
          width: `${width} !important`,
          ...(!resizable ? { minWidth: width, maxWidth: width } : { minWidth: '1px' }),
        },
        sx,
      ]}
      style={style}
      role={sortable ? 'button' : undefined}
      tabIndex={sortable ? 0 : undefined}
      onClick={sortAction}
      onContextMenu={(e) => {
        if (toggleable) {
          e.preventDefault();
          setColumnsPopoverOpened(true);
        }
      }}
      onKeyDown={(e) => e.key === 'Enter' && sortAction?.()}
      ref={columnRef}
    >
      <Group className={classes.sortableColumnHeaderGroup} position="apart" noWrap>
        <Popover
          width={200}
          position="bottom"
          withArrow
          shadow="md"
          opened={columnsPopoverOpened}
          onChange={setColumnsPopoverOpened}
        >
          <Popover.Target>
            <Flex
              align="center"
              w="100%"
              className={cx({
                [classes.draggableColumnHeader]: draggable,
                [classes.draggableColumnHeaderOver]: dragOver,
              })}
              draggable={draggable}
              onDragStart={draggable ? handleColumnDragStart : undefined}
              onDragEnter={draggable ? handleColumnDragEnter : undefined}
              onDragOver={draggable ? handleColumnDragOver : undefined}
              onDrop={draggable ? handleColumnDrop : undefined}
              onDragLeave={draggable ? handleColumnDragLeave : undefined}
            >
              {draggable ? (
                <Center className={classes.draggableColumnHeaderIcon} role="img" aria-label="Drag column">
                  <ActionIcon
                    style={{ cursor: 'grab' }}
                    variant="subtle"
                    size="xs"
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                      e.stopPropagation();
                    }}
                  >
                    <IconGripVertical />
                  </ActionIcon>
                </Center>
              ) : null}

              <Box className={cx(classes.columnHeaderText, classes.sortableColumnHeaderText)} title={tooltip}>
                {text}
              </Box>
            </Flex>
          </Popover.Target>
          <Popover.Dropdown>
            <Stack>
              {columnsToggle
                .filter((column) => column.toggleable)
                .map((column: DataTableColumnToggle) => {
                  return (
                    <Group key={column.accessor}>
                      <Checkbox
                        size="xs"
                        label={
                          allColumns.find((c) => c.accessor === column.accessor)?.title ?? humanize(column.accessor)
                        }
                        checked={column.toggled}
                        onChange={(e) => {
                          setColumnsToggle(
                            columnsToggle.map((c: DataTableColumnToggle) => {
                              if (c.accessor === column.accessor) {
                                return { ...c, toggled: e.currentTarget.checked };
                              }
                              return c;
                            })
                          );
                        }}
                      />
                    </Group>
                  );
                })}
            </Stack>
          </Popover.Dropdown>
        </Popover>
        {toggleable ? (
          <Center className={classes.toggleableColumnHeaderIcon} role="img" aria-label="Toggle column">
            <ActionIcon size="xs" variant="light" onClick={handleColumnToggle}>
              <IconX />
            </ActionIcon>
          </Center>
        ) : null}

        {sortable || sortStatus?.columnAccessor === accessor ? (
          <>
            {sortStatus?.columnAccessor === accessor ? (
              <Center
                className={cx(classes.sortableColumnHeaderIcon, {
                  [classes.sortableColumnHeaderIconRotated]: sortStatus.direction === 'desc',
                })}
                role="img"
                aria-label={`Sorted ${sortStatus.direction === 'desc' ? 'descending' : 'ascending'}`}
              >
                {sortIcons?.sorted || <IconArrowUp size={14} />}
              </Center>
            ) : (
              <Center className={classes.sortableColumnHeaderUnsortedIcon} role="img" aria-label="Not sorted">
                {sortIcons?.unsorted || <IconArrowsVertical size={14} />}
              </Center>
            )}
          </>
        ) : null}
        {filter ? <DataTableHeaderCellFilter isActive={!!filtering}>{filter}</DataTableHeaderCellFilter> : null}
      </Group>
      {resizable ? <DataTableResizableHeaderHandle accessor={accessor as string} columnRef={columnRef} /> : null}
    </Box>
  );
}
