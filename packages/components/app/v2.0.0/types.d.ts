import { ColorScheme } from '@mantine/core';
import { BaseReactProps } from '@packages/node';

export type Props = BaseReactProps & {
	multiInstance?: boolean;
	appLoader?: boolean;
	appLoaderColor?: string;
	colorScheme: ColorScheme | 'auto';
};
