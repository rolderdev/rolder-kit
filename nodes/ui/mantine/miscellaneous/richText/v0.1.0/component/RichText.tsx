import { Link, RichTextEditor, getTaskListExtension } from '@mantine/tiptap'
import { sendOutput } from '@shared/port-send-v1.0.0'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import TaskItem from '@tiptap/extension-task-item'
import TipTapTaskList from '@tiptap/extension-task-list'
import TextAlign from '@tiptap/extension-text-align'
import TextStyle from '@tiptap/extension-text-style'
import Underline from '@tiptap/extension-underline'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import js from 'highlight.js/lib/languages/javascript'
import json from 'highlight.js/lib/languages/json'
import ts from 'highlight.js/lib/languages/typescript'
import { createLowlight } from 'lowlight'
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import type { Props } from '../node/definition'
import Toolbar from './Toolbar'

import '@mantine/tiptap/styles.css'
import IndentHandler from './IndentHandler'
import classes from './code.module.css'

const lowlight = createLowlight()
lowlight.register({ js, ts, json })

const debounceContent = R.libs.remeda.debounce((p: Props, editor: any) => sendOutput(p.noodlNode, 'html', editor.getHTML()), {
	timing: 'trailing',
	waitMs: 500,
})

export default forwardRef((p: Props, ref) => {
	const [isEditor, setIsEditor] = useState(p.isEditor)

	const editor = useEditor({
		extensions: [
			IndentHandler,
			StarterKit.configure({ codeBlock: false }),
			Underline,
			Link,
			Superscript,
			Subscript,
			Highlight,
			TextAlign.configure({ types: ['heading', 'paragraph'] }),
			TextStyle,
			Color,
			CodeBlockLowlight.configure({ lowlight }),
			getTaskListExtension(TipTapTaskList),
			TaskItem.configure({ nested: true }),
		],
		content: p.content,
		onCreate: ({ editor }) => {
			// Нужно проверить на пустой контент на случай, если он подан не сразу на вход.
			if (editor.getHTML() !== '<p></p>') sendOutput(p.noodlNode, 'html', editor.getHTML())
		},
		onUpdate: ({ editor }) => debounceContent.call(p, editor),
		editable: isEditor,
	})

	useEffect(() => {
		if (editor && !isEditor && p.content) editor.commands.setContent(p.content)
	}, [p.content])

	useEffect(() => {
		p.noodlNode._internal.isEditor = isEditor
		sendOutput(p.noodlNode, 'isEditor', isEditor)
	}, [isEditor])

	useImperativeHandle(
		ref,
		() => ({
			toggleEditor: () => setIsEditor(!isEditor),
			restore: (p: Props) => editor && editor.commands.setContent(p.content || ''),
			restoreAndToggle: () => {
				setIsEditor(!isEditor)
				editor && editor.commands.setContent(p.content || '')
			},
			clear: (p: Props) => editor && editor.commands.clearContent(),
		}),
		[isEditor, editor]
	)

	return (
		<RichTextEditor
			editor={editor}
			styles={{
				content: { height: p.height, maxHeight: p.maxHeight, overflow: 'auto' },
			}}
			classNames={{ typographyStylesProvider: classes.code }}
			{...p.customProps}
		>
			{isEditor && <Toolbar {...{ ...p, editor }} />}

			<RichTextEditor.Content />
		</RichTextEditor>
	)
})
