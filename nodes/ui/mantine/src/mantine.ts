import { getCustomEnumType, getPort } from '@packages/port';
import { reactNode } from '@packages/node';
// @ts-ignore
import { defineNode } from '@noodl/noodl-sdk';

const notifEnum = ['top-left', 'top-right', 'top-center', 'bottom-left', 'bottom-right', 'bottom-center'];

import v100 from '@packages/mantine-v1.0.0';
import v200 from '@packages/mantine-v2.0.0';

const mantineNode = reactNode(
	'Mantine',
	{
		'v1.0.0': {
			module: { static: v100 },
			inputs: [
				getPort({
					plug: 'input',
					name: 'notificationsPosition',
					displayName: 'Notifications position',
					group: 'Layout',
					type: getCustomEnumType(notifEnum),
					default: 'bottom-right',
					customs: { isObject: true, required: 'connection' }
				})
			]
		},
		'v2.0.0': {
			hashTag: '#expreimental',
			module: { static: v200 },
			inputs: [
				getPort({
					plug: 'input',
					name: 'notificationsPosition',
					displayName: 'Notifications position',
					group: 'Layout',
					type: getCustomEnumType(notifEnum),
					default: 'bottom-right',
					customs: { isObject: true, required: 'connection' }
				}),
				getPort({
					plug: 'input',
					name: 'defaultColorScheme',
					displayName: 'Default color scheme',
					group: 'Style',
					type: getCustomEnumType(['light', 'dark', 'auto']),
					default: 'light',
					customs: { required: 'connection' }
				}),
				getPort({
					plug: 'input',
					name: 'mantineTheme',
					displayName: 'Mantine theme',
					group: 'Style',
					type: 'array',
					customs: { isObject: true }
				})
			]
		}
	},
	{
		allowChildren: true
		//docs: 'https://docs.rolder.app/docs/project/Mantine.html'
	}
);

//===================================================================
// elements
//// dataDisplay
import imageNode from '@nodes/image';
import badgeNode from '@nodes/badge';
import iconNode from '@nodes/icon';
import barLoaderNode from '@nodes/bar-loader';
import loaderNode from '@nodes/loader';
import indicatorNode from '@nodes/indicator';
//// buttons
import actionIconNode from '@nodes/action-icon';
import buttonNode from '@nodes/button';
import unstyledButtonNode from '@nodes/unstyled-button';
import copyButtonNode from '@nodes/copy-button';
//// inputs
import passwordInputNode from '@nodes/password-input';
import textInputNode from '@nodes/text-input';
import numberInputNode from '@nodes/number-input';
import maskedInputNode from '@nodes/masked-input';
import selectNode from '@nodes/select';
import textareaNode from '@nodes/textarea';
import dateTimePickerNode from '@nodes/date-time-picker';
import segmentedControlNode from '@nodes/segmented-control';
import checkboxGroupNode from '@nodes/checkbox-group';
import checkboxNode from '@nodes/checkbox';
import multiSelectNode from '@nodes/multi-select';
import datePickerInputNode from '@nodes/date-picker-input';
import switchNode from '@nodes/switch';
//// miscellaneous
import notificationNode from '@nodes/notification';
import dividerNode from '@nodes/divider';
import dropZoneNode from '@nodes/drop-zone';
import webCameraNode from '@nodes/web-camera';
//// typography
import textNode from '@nodes/text';
import titleNode from '@nodes/title';
import highlightNode from '@nodes/highlight';
import listNode from '@nodes/list';
//// navigation
import navLinkNode from '@nodes/nav-link';
// molecules
import formNode from '@nodes/form';
import groupNode from '@nodes/group';
import stackNode from '@nodes/stack';
import boxNode from '@nodes/box';
import flexNode from '@nodes/flex';
import centerNode from '@nodes/center';
import paperNode from '@nodes/paper';
import avatarNode from '@nodes/avatar';
import scrollAreaNode from '@nodes/scroll-area';
import gridNode from '@nodes/grid';
import carouselNode from '@nodes/carousel';
import modalNode from '@nodes/modal';
import drawerNode from '@nodes/drawer';
//// hoverCard
import hoverCardNode from '@nodes/hover-card';
import hoverCardTargetNode from '@nodes/hover-card-target';
import hoverCardDropdownNode from '@nodes/hover-card-dropdown';
//// popover
import popoverNode from '@nodes/popover';
import popoverTargetNode from '@nodes/popover-target';
import popoverDropdownNode from '@nodes/popover-dropdown';
//// tabs
import tabsNode from '@nodes/tabs';
import tabNode from '@nodes/tab';
// organisms
//// table
import tableNode from '@nodes/table';
import columnCellNode from '@nodes/column-cell';
import expansionRowNode from '@nodes/expansion-row';
import columnFilterNode from '@nodes/column-filter';
import tableSelectionScopeNode from '@nodes/table-selection-scope'; // MD
//// appShell
import appShellNode from '@nodes/app-shell';
import headerNode from '@nodes/header';
import footerNode from '@nodes/app-shell/modules/footer';
import navbarNode from '@nodes/app-shell/modules/navbar';
import navbarSectionNode from '@nodes/app-shell/modules/navbar/modules/navbarSection';
import asideNode from '@nodes/app-shell/modules/aside';
import asideSectionNode from '@nodes/app-shell/modules/aside/modules/asideSection';

Noodl.defineModule({
	reactNodes: [
		mantineNode,
		// elements
		//// dataDisplay
		imageNode,
		badgeNode,
		iconNode,
		barLoaderNode,
		loaderNode,
		indicatorNode,
		//// buttons
		actionIconNode,
		buttonNode,
		unstyledButtonNode,
		copyButtonNode,
		//// inputs
		passwordInputNode,
		textInputNode,
		numberInputNode,
		maskedInputNode,
		selectNode,
		textareaNode,
		dateTimePickerNode,
		segmentedControlNode,
		checkboxGroupNode,
		checkboxNode,
		multiSelectNode,
		datePickerInputNode,
		switchNode,
		//// miscellaneous
		dividerNode,
		dropZoneNode,
		webCameraNode,
		//// typography
		textNode,
		titleNode,
		highlightNode,
		listNode,
		//// navigation
		navLinkNode,
		// molecules
		formNode,
		groupNode,
		stackNode,
		boxNode,
		flexNode,
		centerNode,
		paperNode,
		avatarNode,
		scrollAreaNode,
		gridNode,
		carouselNode,
		modalNode,
		drawerNode,
		tabsNode,
		tabNode,
		//// hoverCard
		hoverCardNode,
		hoverCardTargetNode,
		hoverCardDropdownNode,
		//// popover
		popoverNode,
		popoverTargetNode,
		popoverDropdownNode,
		// organisms
		//// table
		tableNode,
		columnCellNode,
		expansionRowNode,
		columnFilterNode,
		tableSelectionScopeNode, // MD
		//// appShell
		appShellNode,
		headerNode,
		footerNode,
		navbarNode,
		navbarSectionNode,
		asideNode,
		asideSectionNode
	],
	nodes: [defineNode(notificationNode)]
});
