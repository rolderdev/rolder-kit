import { createSafeContext } from '@mantine/utils';
import type { Dispatch, SetStateAction } from 'react';
import type { DataTableColumnToggle } from './hooks';

interface DataTableDragToggleColumnsContext {
  // accessor of the column which is currently dragged
  sourceColumn: string;
  setSourceColumn: Dispatch<SetStateAction<string>>;

  // accessor of the column which is currently hovered
  targetColumn: string;
  setTargetColumn: Dispatch<SetStateAction<string>>;

  // swap the source column with the target column
  swapColumns: () => void;

  // reset to the default columns order
  resetColumnsOrder: () => void;

  columnsToggle: DataTableColumnToggle[];
  setColumnsToggle: Dispatch<SetStateAction<DataTableColumnToggle[]>>;
  resetColumnsToggle: () => void;

  setColumnWidth: (accessor: string, width: string | number) => void;
  resetColumnsWidth: () => void;
}

export const [DataTableDragToggleColumnsContextProvider, useDataTableDragToggleColumnsContext] =
  createSafeContext<DataTableDragToggleColumnsContext>(
    'useDataTableDragToggleColumnsContext must be used within DataTableDragToggleColumnOrdersProvider'
  );
