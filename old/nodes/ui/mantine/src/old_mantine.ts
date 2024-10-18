// @ts-ignore
import { defineNode } from '@noodl/noodl-sdk'
import { reactNode } from '@packages/node'
import { getCustomEnumType, getPort } from '@packages/port'

const notifEnum = ['top-left', 'top-right', 'top-center', 'bottom-left', 'bottom-right', 'bottom-center']

import v100 from '@packages/mantine-v1.0.0'

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
)

// buttons
import actionIconNode from '@nodes/action-icon'
//// appShell
import appShellNode from '@nodes/app-shell'
import asideNode from '@nodes/app-shell/modules/aside'
import asideSectionNode from '@nodes/app-shell/modules/aside/modules/asideSection'
import footerNode from '@nodes/app-shell/modules/footer'
import navbarNode from '@nodes/app-shell/modules/navbar'
import navbarSectionNode from '@nodes/app-shell/modules/navbar/modules/navbarSection'
import avatarNode from '@nodes/avatar'
import badgeNode from '@nodes/badge'
// feedback
import barLoaderNode from '@nodes/bar-loader'
import boxNode from '@nodes/box'
import buttonNode from '@nodes/button'
import carouselNode from '@nodes/carousel'
import centerNode from '@nodes/center'
import checkboxNode from '@nodes/checkbox'
import checkboxGroupNode from '@nodes/checkbox-group'
import columnCellNode from '@nodes/column-cell'
import columnFilterNode from '@nodes/column-filter'
import copyButtonNode from '@nodes/copy-button'
import datePickerInputNode from '@nodes/date-picker-input'
import dateTimePickerNode from '@nodes/date-time-picker'
import dividerNode from '@nodes/divider'
import drawerNode from '@nodes/drawer'
import dropZoneNode from '@nodes/drop-zone'
import expansionRowNode from '@nodes/expansion-row'
import flexNode from '@nodes/flex'
// layout
import formNode from '@nodes/form'
import gridNode from '@nodes/grid'
import groupNode from '@nodes/group'
import headerNode from '@nodes/header'
import highlightNode from '@nodes/highlight'
import iconNode from '@nodes/icon'
//===================================================================
// dataDisplay
import imageNode from '@nodes/image'
import indicatorNode from '@nodes/indicator'
import listNode from '@nodes/list'
import loaderNode from '@nodes/loader'
import maskedInputNode from '@nodes/masked-input'
import modalNode from '@nodes/modal'
import multiSelectNode from '@nodes/multi-select'
// navigation
import navLinkNode from '@nodes/nav-link'
// miscellaneous
import notificationNode from '@nodes/notification'
import numberInputNode from '@nodes/number-input'
import paperNode from '@nodes/paper'
// inputs
import passwordInputNode from '@nodes/password-input'
import scrollAreaNode from '@nodes/scroll-area'
import segmentedControlNode from '@nodes/segmented-control'
import selectNode from '@nodes/select'
import stackNode from '@nodes/stack'
import switchNode from '@nodes/switch'
import tabNode from '@nodes/tab'
//// table
import tableNode from '@nodes/table'
import tableSelectionScopeNode from '@nodes/table-selection-scope' // MD
import tableScopeNode from '@nodes/table/modules/tableScope'
//import anchorNode from '@nodes/anchor';
//// tabs
import tabsNode from '@nodes/tabs'
// typography
import textNode from '@nodes/text'
import textInputNode from '@nodes/text-input'
import textareaNode from '@nodes/textarea'
import titleNode from '@nodes/title'
import unstyledButtonNode from '@nodes/unstyled-button'
import webCameraNode from '@nodes/web-camera'
// overlays
//// hoverCard
import hoverCardNode from './overlays/hoverCard/hoverCardNode'
import hoverCardDropdownNode from './overlays/hoverCard/modules/hoverCardDropdown/hoverCardDropdownNode'
import hoverCardTargetNode from './overlays/hoverCard/modules/hoverCardTarget/hoverCardTargetNode'
import popoverDropdownNode from './overlays/popover/modules/popoverDropdown/popoverDropdownNode'
import popoverTargetNode from './overlays/popover/modules/popoverTarget/popoverTargetNode'
//// popover
import popoverNode from './overlays/popover/popoverNode'

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
})
