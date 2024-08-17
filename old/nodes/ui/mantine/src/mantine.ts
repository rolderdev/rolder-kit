import { getCustomEnumType, getPort } from '@packages/port';
import { reactNode } from '@packages/node';
// @ts-ignore
import { defineNode } from '@noodl/noodl-sdk';

const notifEnum = ['top-left', 'top-right', 'top-center', 'bottom-left', 'bottom-right', 'bottom-center'];

import v100 from '@packages/mantine-v1.0.0';

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
					customs: { isObject: true, required: 'connection' },
				}),
			],
		},
	},
	{
		allowChildren: true,
		//docs: 'https://docs.rolder.app/docs/project/Mantine.html'
	}
);

//===================================================================
// dataDisplay
import imageNode from '@nodes/image';
import badgeNode from '@nodes/badge';
import iconNode from '@nodes/icon';
import indicatorNode from '@nodes/indicator';
//// table
import tableNode from '@nodes/table';
import columnCellNode from '@nodes/column-cell';
import expansionRowNode from '@nodes/expansion-row';
import columnFilterNode from '@nodes/column-filter';
import tableSelectionScopeNode from '@nodes/table-selection-scope'; // MD
import tableScopeNode from '@nodes/table/modules/tableScope';
// feedback
import barLoaderNode from '@nodes/bar-loader';
import loaderNode from '@nodes/loader';
// buttons
import actionIconNode from '@nodes/action-icon';
import buttonNode from '@nodes/button';
import unstyledButtonNode from '@nodes/unstyled-button';
import copyButtonNode from '@nodes/copy-button';
// inputs
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
// miscellaneous
import notificationNode from '@nodes/notification';
import dividerNode from '@nodes/divider';
import dropZoneNode from '@nodes/drop-zone';
import webCameraNode from '@nodes/web-camera';
// typography
import textNode from '@nodes/text';
import titleNode from '@nodes/title';
import highlightNode from '@nodes/highlight';
import listNode from '@nodes/list';
// navigation
import navLinkNode from '@nodes/nav-link';
import anchorNode from '@nodes/anchor';
//// tabs
import tabsNode from '@nodes/tabs';
import tabNode from '@nodes/tab';
//// appShell
import appShellNode from '@nodes/app-shell';
import headerNode from '@nodes/header';
import footerNode from '@nodes/app-shell/modules/footer';
import navbarNode from '@nodes/app-shell/modules/navbar';
import navbarSectionNode from '@nodes/app-shell/modules/navbar/modules/navbarSection';
import asideNode from '@nodes/app-shell/modules/aside';
import asideSectionNode from '@nodes/app-shell/modules/aside/modules/asideSection';
// layout
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
// overlays
import tooltipNode from './overlays/tooltip/tooltipNode';
//// hoverCard
import hoverCardNode from './overlays/hoverCard/hoverCardNode';
import hoverCardTargetNode from './overlays/hoverCard/modules/hoverCardTarget/hoverCardTargetNode';
import hoverCardDropdownNode from './overlays/hoverCard/modules/hoverCardDropdown/hoverCardDropdownNode';
//// popover
import popoverNode from './overlays/popover/popoverNode';
import popoverTargetNode from './overlays/popover/modules/popoverTarget/popoverTargetNode';
import popoverDropdownNode from './overlays/popover/modules/popoverDropdown/popoverDropdownNode';

Noodl.defineModule({
	reactNodes: [
		mantineNode,
		// dataDisplay
		imageNode,
		badgeNode,
		iconNode,
		barLoaderNode,
		loaderNode,
		indicatorNode,
		//// table
		tableNode,
		columnCellNode,
		expansionRowNode,
		columnFilterNode,
		tableSelectionScopeNode, // MD
		tableScopeNode,
		// buttons
		actionIconNode,
		buttonNode,
		unstyledButtonNode,
		copyButtonNode,
		// inputs
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
		// miscellaneous
		dividerNode,
		dropZoneNode,
		webCameraNode,
		// typography
		textNode,
		titleNode,
		highlightNode,
		listNode,
		// navigation
		navLinkNode,
		anchorNode,
		//// tabs
		tabsNode,
		tabNode,
		//// appShell
		appShellNode,
		headerNode,
		footerNode,
		navbarNode,
		navbarSectionNode,
		asideNode,
		asideSectionNode,
		// layout
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
		// overlays
		tooltipNode,
		//// hoverCard
		hoverCardNode,
		hoverCardTargetNode,
		hoverCardDropdownNode,
		//// popover
		popoverNode,
		popoverTargetNode,
		popoverDropdownNode,
	],
	nodes: [defineNode(notificationNode)],
});
