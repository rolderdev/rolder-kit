import { set } from 'shared/src/libs/just';
//@ts-ignore
import { defineNode } from '@noodl/noodl-sdk';

import mantine from './src/mantine';
// dataDispaly
import table from './dataDisplay/table';
import tableFilter from './dataDisplay/modules/tableFilter';
// feedback
import notification from './feedback/notification';
// inputs
import numberInput from './inputs/numberInput';
// lyaout
import stack from './layout/stack';
// miscellaneous
import richText from './miscellaneous/richText';
import transition from './miscellaneous/transition';
// navigation
import anchor from './navigation/anchor';
// overlays
import tooltip from './overlays/tooltip';
// typography
import text from './typography/text';

const reactPackages = [mantine, table, numberInput, stack, richText, transition, anchor, tooltip, text];
const jsPackages = [notification, tableFilter];

set(
	window,
	['R', 'packages', 'mantine'],
	[
		{
			name: 'Rolder Kit - UI - Mantine',
			type: '',
			subCategories: [
				{
					name: '',
					items: ['rolder-kit.api-v1.Mantine'],
				},
				{
					name: 'Layout',
					items: [
						/* 'rolder-kit.api-v1.Box',
            'rolder-kit.api-v1.Group', */
						'rolder-kit.api-v1.Stack',
						/* 'rolder-kit.api-v1.Flex',
						'rolder-kit.api-v1.Grid',
						'rolder-kit.api-v1.Center',
						'rolder-kit.api-v1.Paper',
						'rolder-kit.api-v1.ScrollArea',
						'rolder-kit.api-v1.Drawer',
						'rolder-kit.api-v1.Modal',
						'rolder-kit.api-v1.Form',
						'rolder-kit.api-v1.Carousel', */
					],
				},
				{
					name: 'Typography',
					items: [
						/* 'rolder-kit.api-v1.Title', */ 'rolder-kit.api-v1.Text' /* 'rolder-kit.api-v1.Highlight', 'rolder-kit.api-v1.List' */,
					],
				},
				/* {
					name: 'Inputs',
					items: [
						'rolder-kit.api-v1.TextInput',
						'rolder-kit.api-v1.NumberInput',
						'rolder-kit.api-v1.MaskedInput',
						'rolder-kit.api-v1.PasswordInput',
						'rolder-kit.api-v1.Textarea',
						'rolder-kit.api-v1.Select',
						'rolder-kit.api-v1.MultiSelect',
						'rolder-kit.api-v1.Checkbox',
						'rolder-kit.api-v1.CheckboxGroup',
						'rolder-kit.api-v1.SegmentedControl',
						'rolder-kit.api-v1.DatePickerInput',
						'rolder-kit.api-v1.DateTimePicker',
						'rolder-kit.api-v1.Switch',
					],
				}, */
				/* {
					name: 'Buttons',
					items: [
						'rolder-kit.api-v1.ActionIcon',
						'rolder-kit.api-v1.Button',
						'rolder-kit.api-v1.UnstyledButton',
						'rolder-kit.api-v1.CopyButton',
					],
				}, */
				{
					name: 'DataDisplay',
					items: [
						/* 'rolder-kit.api-v1.Image',
						'rolder-kit.api-v1.Badge',
						'rolder-kit.api-v1.Icon',
						'rolder-kit.api-v1.Indicator',
						'rolder-kit.api-v1.Avatar',
						'rolder-kit.api-v1.Loader',
						'rolder-kit.api-v1.BarLoader', */
					],
				},
				{
					name: 'Table',
					items: ['rolder-kit.api-v1.Table', 'rolder-kit.api-v1.tableFilter'],
				},
				/* {
					name: 'Popover',
					items: ['rolder-kit.api-v1.Popover', 'rolder-kit.api-v1.PopoverTarget', 'rolder-kit.api-v1.PopoverDropdown'],
				},
				{
					name: 'HoverCard',
					items: ['rolder-kit.api-v1.HoverCard', 'rolder-kit.api-v1.HoverCardTarget', 'rolder-kit.api-v1.HoverCardDropdown'],
				}, */
				{
					name: 'Miscellaneous',
					items: ['rolder-kit.api-v1.notification' /* 'rolder-kit.api-v1.Divider', 'rolder-kit.api-v1.DropZoneNode' */],
				},
				{
					name: 'Navigation',
					items: [
						/* 'rolder-kit.api-v1.AppShell',
						'rolder-kit.api-v1.Header',
						'rolder-kit.api-v1.Footer',
						'rolder-kit.api-v1.Navbar',
						'rolder-kit.api-v1.NavbarSection',
						'rolder-kit.api-v1.Aside',
						'rolder-kit.api-v1.AsideSection',
						'rolder-kit.api-v1.NavLink', */
						'rolder-kit.api-v1.Anchor',
						/* 'rolder-kit.api-v1.Tabs',
						'rolder-kit.api-v1.Tab', */
					],
				},
			],
		},
	]
);

Noodl.defineModule({ name: 'mantine', reactNodes: reactPackages, nodes: jsPackages.map(defineNode) });
