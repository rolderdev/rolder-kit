import { MantineColor, type SelectItem } from '@mantine/core';
import { BaseReactProps } from '@packages/node';
import { Scope } from '@packages/scope';

export type Props = BaseReactProps & {
	controlled: boolean;
	useScope?: boolean;
	scope?: Scope;
	formField: string;
	inputError?: boolean | string;
	iconName?: string;
	iconSize?: string;
	iconStroke?: number;
	iconColor?: string;
	inputItems?: SelectItem[];
	labelField?: string;
	backgroundColor?: MantineColor;
	selectedItem?: SelectItem;
};
