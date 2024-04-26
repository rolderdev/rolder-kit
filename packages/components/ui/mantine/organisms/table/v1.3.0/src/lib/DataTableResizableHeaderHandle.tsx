import { createStyles, getStylesRef } from '@mantine/core';
import { MutableRefObject, useRef, useState } from 'react';
import { useDataTableDragToggleColumnsContext } from './DataTableDragToggleColumns.context';

type DataTableResizableHeaderHandleProps = {
  accessor: string;
  columnRef: MutableRefObject<HTMLTableCellElement | null>;
};

const useStyles = createStyles((theme) => ({
  resizableColumnHeaderHandle: {
    ref: getStylesRef('resizableColumnHeaderHandle'),
    position: 'absolute',
    cursor: 'col-resize',
    top: 0,
    bottom: 0,
    width: '7px',
    transform: 'translateX(4px)',
    zIndex: 1,
    '::after': {
      content: '""',
      position: 'absolute',
      top: '1px',
      left: '2px',
      bottom: '1px',
      background: 'inherit',
      borderLeft: `3px dotted ${theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[3]}`,
      opacity: 0,
    },
    '&:hover::after': {
      borderLeftColor: theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 6 : 4],
    },
    'tr:hover &::after': {
      opacity: 1,
    },
  },
}));

export const DataTableResizableHeaderHandle = (props: DataTableResizableHeaderHandleProps) => {
  const { accessor, columnRef } = props;

  const { classes } = useStyles();

  const dragRef = useRef<HTMLTableCellElement>(null);

  const [deltaX, setDeltaX] = useState<number>(0);

  const { setColumnWidth } = useDataTableDragToggleColumnsContext();

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    document.body.style.cursor = 'col-resize';
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!columnRef.current) return;

    const delta = event.clientX - columnRef.current.getBoundingClientRect().right;

    const width = columnRef.current.getBoundingClientRect().width + delta;

    const widthString = `${width}px`;

    columnRef.current.style.width = widthString;

    // we have to set (store) the width in the context  and in the
    // local storage, otherwise the resizing won't work for small sizes
    setColumnWidth(accessor, columnRef.current.style.width as string);

    setDeltaX(-delta);
  };

  const handleMouseUp = () => {
    if (!columnRef.current) return;

    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);

    document.body.style.cursor = 'initial';

    setColumnWidth(accessor, columnRef.current.style.width as string);

    columnRef.current.style.width = 'initial';

    setDeltaX(0);
  };

  /**
   * Reset the column width to the default value
   */
  const handleDoubleClick = () => {
    if (!columnRef.current) return;

    columnRef.current.style.maxWidth = 'initial';
    columnRef.current.style.minWidth = 'initial';
    columnRef.current.style.width = 'initial';

    setColumnWidth(accessor, 'initial');
  };

  return (
    <div
      ref={dragRef}
      onClick={(event) => event.stopPropagation()}
      onMouseDown={handleDragStart}
      onDoubleClick={handleDoubleClick}
      className={classes.resizableColumnHeaderHandle}
      style={{
        right: deltaX,
      }}
    ></div>
  );
};
