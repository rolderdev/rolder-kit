import { BaseReactProps } from '@packages/node';
import type { MultiSelectionFilterFunc } from './src/store';

export type Props = BaseReactProps & {
	selectionDbClasses?: string[];
	multiSelectionFilterFunc: MultiSelectionFilterFunc | undefined;
};
