import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { sendOutput } from '@shared/port-send-v1.0.0';
import type { Props } from '../node/definition';
import { getTaskListExtension, Link, RichTextEditor } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Superscript from '@tiptap/extension-superscript';
import Subscript from '@tiptap/extension-subscript';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { createLowlight } from 'lowlight';
import js from 'highlight.js/lib/languages/javascript';
import ts from 'highlight.js/lib/languages/typescript';
import json from 'highlight.js/lib/languages/json';
import TipTapTaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Toolbar from './Toolbar';

import '@mantine/tiptap/styles.css';
import classes from './code.module.css';
import IndentHandler from './IndentHandler';

const lowlight = createLowlight();
lowlight.register({ js, ts, json });

export default forwardRef(function (p: Props, ref) {
	const [isEditor, setIsEditor] = useState(p.isEditor);

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
			TaskItem.configure({
				nested: true,
				HTMLAttributes: {
					class: 'test-item',
				},
			}),
		],
		content: p.content,
		onCreate: ({ editor }) => sendOutput(p.noodlNode, 'html', editor.getHTML()),
		onUpdate: ({ editor }) => sendOutput(p.noodlNode, 'html', editor.getHTML()),
		editable: isEditor,
	});

	useEffect(() => {
		if (editor && p.content) editor.commands.setContent(p.content);
	}, [p.content]);

	useEffect(() => {
		p.noodlNode._internal.isEditor = isEditor;
		sendOutput(p.noodlNode, 'isEditor', isEditor);
	}, [isEditor]);

	useImperativeHandle(
		ref,
		() => ({
			toggleEditor: () => setIsEditor(!isEditor),
			restore: (p: Props) => editor && editor.commands.setContent(p.content || ''),
			restoreAndToggle: () => {
				setIsEditor(!isEditor);
				editor && editor.commands.setContent(p.content || '');
			},
			clear: (p: Props) => editor && editor.commands.clearContent(),
		}),
		[isEditor, editor]
	);

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
	);
});
