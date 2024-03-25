import { getCustomEnumType, getPort } from '@shared/port'
import { reactNode } from '@shared/node'
import { lazy } from 'react'
// @ts-ignore
import { defineNode } from '@noodl/noodl-sdk'

const notifEnum = ['top-left', 'top-right', 'top-center', 'bottom-left', 'bottom-right', 'bottom-center']

const mantineNode = reactNode('Mantine', {
    'v1.0.0': {
        module: {
            dynamic: lazy(() => import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                '@shared/mantine-v1.0.0'))
        },
        inputs: [
            getPort({
                plug: 'input', name: 'notificationsPosition', displayName: 'Notifications position', group: 'Layout',
                type: getCustomEnumType(notifEnum), default: 'bottom-right', customs: { isObject: true, required: 'connection' }
            }),
        ],
    }
}, { allowChildren: true })

//===================================================================
// elements
//// dataDisplay
import imageNode from '@nodes/image'
import badgeNode from '@nodes/badge'
import iconNode from '@nodes/icon'
import barLoaderNode from '@nodes/bar-loader'
import loaderNode from '@nodes/loader'
import indicatorNode from '@nodes/indicator'
//// buttons
import actionIconNode from '@nodes/action-icon'
import buttonNode from '@nodes/button'
import unstyledButtonNode from '@nodes/unstyled-button'
//// inputs
import passwordInputNode from '@nodes/password-input'
import textInputNode from '@nodes/text-input'
import numberInputNode from '@nodes/number-input'
import maskedInputNode from '@nodes/masked-input'
import selectNode from '@nodes/select'
import textareaNode from '@nodes/textarea'
import dateTimePickerNode from '@nodes/date-time-picker'
import segmentedControlNode from '@nodes/segmented-control'
import checkboxGroupNode from '@nodes/checkbox-group'
import checkboxNode from "@nodes/checkbox"
import multiSelectNode from "@nodes/multi-select"
import datePickerInputNode from '@nodes/date-picker-input'
//// miscellaneous
import notificationNode from '@nodes/notification'
import dividerNode from '@nodes/divider'
//// typography
import textNode from '@nodes/text'
import titleNode from '@nodes/title'
import highlightNode from '@nodes/highlight'
import listNode from '@nodes/list'
//// navigation
import navLinkNode from '@nodes/nav-link'
// molecules
import formNode from '@nodes/form'
import groupNode from '@nodes/group'
import stackNode from '@nodes/stack'
import boxNode from '@nodes/box'
import flexNode from '@nodes/flex'
import centerNode from '@nodes/center'
import paperNode from '@nodes/paper'
import avatarNode from '@nodes/avatar'
import scrollAreaNode from '@nodes/scroll-area'
//// hoverCard
import hoverCardNode from '@nodes/hover-card'
import hoverCardTargetNode from '@nodes/hover-card-target'
import hoverCardDropdownNode from '@nodes/hover-card-dropdown'
//// popover
import popoverNode from '@nodes/popover'
import popoverTargetNode from '@nodes/popover-target'
import popoverDropdownNode from '@nodes/popover-dropdown'
// organisms
//// table
import tableNode from '@nodes/table'
import columnCellNode from '@nodes/column-cell'
import expansionRowNode from '@nodes/expansion-row'
import columnFilterNode from '@nodes/column-filter'

Noodl.defineModule({
    reactNodes: [
        mantineNode,
        // elements
        //// dataDisplay
        imageNode, badgeNode, iconNode, barLoaderNode, loaderNode, indicatorNode,
        //// buttons
        actionIconNode, buttonNode, unstyledButtonNode,
        //// inputs
        passwordInputNode, textInputNode, numberInputNode, maskedInputNode, selectNode, textareaNode, dateTimePickerNode,
        segmentedControlNode, checkboxGroupNode, checkboxNode, multiSelectNode, datePickerInputNode,
        //// miscellaneous
        dividerNode,
        //// typography
        textNode, titleNode, highlightNode, listNode,
        //// navigation
        navLinkNode,
        // molecules
        formNode, groupNode, stackNode, boxNode, flexNode, centerNode, paperNode, avatarNode, scrollAreaNode,
        //// hoverCard
        hoverCardNode, hoverCardTargetNode, hoverCardDropdownNode,
        //// popover
        popoverNode, popoverTargetNode, popoverDropdownNode,
        // organisms
        //// table
        tableNode, columnCellNode, expansionRowNode, columnFilterNode,
    ],
    nodes: [defineNode(notificationNode)]
})