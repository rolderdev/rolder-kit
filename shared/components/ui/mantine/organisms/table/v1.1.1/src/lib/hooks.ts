import { useLocalStorage, useResizeObserver, useTimeout } from '@mantine/hooks';
import { useEffect, useMemo, useState, type Key } from 'react';
import type { DataTableColumn, DataTableRowExpansionProps } from './types';
import { getRecordId } from './utils';

export function useLastSelectionChangeIndex(recordIds: unknown[] | undefined) {
  const [lastSelectionChangeIndex, setLastSelectionChangeIndex] = useState<number | null>(null);
  const recordIdsString = recordIds?.join(':') || '';
  useEffect(() => {
    setLastSelectionChangeIndex(null);
  }, [recordIdsString]);

  return { lastSelectionChangeIndex, setLastSelectionChangeIndex };
}

export function useRowContextMenu<T>(fetching?: boolean) {
  const [rowContextMenuInfo, setRowContextMenuInfo] = useState<{
    y: number;
    x: number;
    record: T;
    recordIndex: number;
  } | null>(null);
  useEffect(() => {
    if (fetching) setRowContextMenuInfo(null);
  }, [fetching]);
  return { rowContextMenuInfo, setRowContextMenuInfo };
}

export function useRowExpansion<T>({
  rowExpansion,
  records,
  idAccessor,
}: {
  rowExpansion?: DataTableRowExpansionProps<T>;
  records: T[] | undefined;
  idAccessor: string | ((record: T) => Key);
}) {
  let initiallyExpandedRecordIds: unknown[] = [];
  if (rowExpansion && records) {
    const { trigger, allowMultiple, initiallyExpanded } = rowExpansion;
    if (records && trigger === 'always') {
      initiallyExpandedRecordIds = records.map((r) => getRecordId(r, idAccessor));
    } else if (initiallyExpanded) {
      initiallyExpandedRecordIds = records.filter(initiallyExpanded).map((r) => getRecordId(r, idAccessor));
      if (!allowMultiple) {
        initiallyExpandedRecordIds = [initiallyExpandedRecordIds[0]];
      }
    }
  }

  let expandedRecordIds: unknown[];
  let setExpandedRecordIds: ((expandedRecordIds: unknown[]) => void) | undefined;
  const expandedRecordIdsState = useState<unknown[]>(initiallyExpandedRecordIds);

  if (rowExpansion) {
    const { trigger, allowMultiple, collapseProps, content } = rowExpansion;
    if (rowExpansion.expanded) {
      ({ recordIds: expandedRecordIds, onRecordIdsChange: setExpandedRecordIds } = rowExpansion.expanded);
    } else {
      [expandedRecordIds, setExpandedRecordIds] = expandedRecordIdsState;
    }

    const collapseRow = (record: T) =>
      setExpandedRecordIds?.(expandedRecordIds.filter((id) => id !== getRecordId(record, idAccessor)));

    return {
      expandOnClick: trigger !== 'always' && trigger !== 'never',
      isRowExpanded: (record: T) =>
        trigger === 'always' ? true : expandedRecordIds.includes(getRecordId(record, idAccessor)),
      expandRow: (record: T) => {
        const recordId = getRecordId(record, idAccessor);
        setExpandedRecordIds?.(allowMultiple ? [...expandedRecordIds, recordId] : [recordId]);
      },
      collapseRow,
      collapseProps,
      content: (record: T, recordIndex: number) => () =>
        content({ record, recordIndex, collapse: () => collapseRow(record) }),
    };
  }
}

export function useRowExpansionStatus(open: boolean, transitionDuration?: number) {
  const [expanded, setExpanded] = useState(open);
  const [visible, setVisible] = useState(open);

  const expand = useTimeout(() => setExpanded(true), 0);
  const hide = useTimeout(() => setVisible(false), transitionDuration || 200);

  useEffect(() => {
    if (open) {
      hide.clear();
      setVisible(true);
      expand.start();
    } else {
      expand.clear();
      setExpanded(false);
      hide.start();
    }
  }, [expand, hide, open]);

  return { expanded, visible };
}

export function useElementOuterSize<T extends HTMLElement>() {
  const [ref] = useResizeObserver<T>();
  const { width, height } = ref.current?.getBoundingClientRect() || { width: 0, height: 0 };
  return { ref, width, height };
}

export type DataTableColumnToggle = {
  accessor: string;
  defaultToggle: boolean;
  toggleable: boolean;
  toggled: boolean;
};

type DataTableColumnWidth = Record<string, string | number>;

export const useDataTableColumns = <T>({
  key,
  columns = [],
}: {
  key: string | undefined;
  columns: DataTableColumn<T>[];
}) => {
  // Default columns id ordered is the order of the columns in the array
  const defaultColumnsOrder = (columns && columns.map((column) => column.accessor)) || [];

  // create an array of object with key = accessor and value = width
  const defaultColumnsWidth =
    (columns && columns.map((column) => ({ [column.accessor]: column.width ?? 'initial' }))) || [];

  // Default columns id toggled is the array of columns which have the toggleable property set to true
  const defaultColumnsToggle =
    columns &&
    columns.map((column) => ({
      accessor: column.accessor,
      defaultToggle: column.defaultToggle || true,
      toggleable: column.toggleable,
      toggled: column.defaultToggle === undefined ? true : column.defaultToggle,
    }));

  // Store the columns order in localStorage
  const [columnsOrder, setColumnsOrder] = useLocalStorage<string[]>({
    key: `${key}-columns-order`,
    defaultValue: defaultColumnsOrder as string[],
    getInitialValueInEffect: true,
  });

  // Store the columns toggle in localStorage
  const [columnsToggle, setColumnsToggle] = useLocalStorage<DataTableColumnToggle[]>({
    key: `${key}-columns-toggle`,
    defaultValue: defaultColumnsToggle as DataTableColumnToggle[],
    getInitialValueInEffect: true,
  });

  // Store the columns width in localStorage
  const [columnsWidth, setColumnsWidth] = useLocalStorage<DataTableColumnWidth[]>({
    key: `${key}-columns-width`,
    defaultValue: defaultColumnsWidth as DataTableColumnWidth[],
    getInitialValueInEffect: true,
  });

  // we won't use the "remove" function from useLocalStorage() because
  // we got issue with rendering
  const resetColumnsOrder = () => setColumnsOrder(defaultColumnsOrder as string[]);

  const resetColumnsToggle = () => {
    setColumnsToggle(defaultColumnsToggle as DataTableColumnToggle[]);
  };

  const resetColumnsWidth = () => setColumnsWidth(defaultColumnsWidth as DataTableColumnWidth[]);

  const effectiveColumns = useMemo(() => {
    if (!columnsOrder) {
      return columns;
    }

    const result = columnsOrder
      .map((order) => columns.find((column) => column.accessor === order))
      .map((column) => {
        return {
          ...column,
          hidden: !columnsToggle.find((toggle) => {
            return toggle.accessor === column?.accessor;
          })?.toggled,
        };
      }) as DataTableColumn<T>[];

    const newWidths = result.map((column) => {
      return {
        ...column,
        width: columnsWidth.find((width) => {
          return width[column?.accessor as string];
        })?.[column?.accessor as string],
      };
    });

    return newWidths;
  }, [columns, columnsOrder, columnsToggle, columnsWidth]);

  const setColumnWidth = (accessor: string, width: string | number) => {
    const newColumnsWidth = columnsWidth.map((column) => {
      if (!column[accessor]) {
        return column;
      }
      return {
        [accessor]: width,
      };
    });

    setColumnsWidth(newColumnsWidth);
  };

  return {
    effectiveColumns: effectiveColumns as DataTableColumn<T>[],

    // Order handling
    setColumnsOrder,
    columnsOrder: columnsOrder as string[],
    resetColumnsOrder,

    // Toggle handling
    columnsToggle: columnsToggle as DataTableColumnToggle[],
    setColumnsToggle,
    resetColumnsToggle,

    // Resize handling
    columnsWidth,
    setColumnsWidth,
    setColumnWidth,
    resetColumnsWidth,
  } as const;
};
