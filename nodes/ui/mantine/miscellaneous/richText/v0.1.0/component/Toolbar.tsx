import { RichTextEditor } from '@mantine/tiptap'
import type { Props } from '../node/definition'

export default (p: Props & { editor: any }) => {
	const { IconSourceCode, IconFlask, IconRocket, IconCheck, IconBan } = R.libs.icons

	return (
		<RichTextEditor.Toolbar sticky={p.sticky} stickyOffset={p.stickyOffset}>
			<RichTextEditor.ControlsGroup>
				<RichTextEditor.Bold />
				<RichTextEditor.Italic />
				<RichTextEditor.Underline />
				<RichTextEditor.Strikethrough />
				<RichTextEditor.Highlight />
				<RichTextEditor.ClearFormatting />
			</RichTextEditor.ControlsGroup>
			<RichTextEditor.ControlsGroup>
				<RichTextEditor.H1 />
				<RichTextEditor.H2 />
				<RichTextEditor.H3 />
				<RichTextEditor.H4 />
				<RichTextEditor.H5 />
			</RichTextEditor.ControlsGroup>
			<RichTextEditor.ControlsGroup>
				<RichTextEditor.Code />
				<RichTextEditor.CodeBlock icon={() => <IconSourceCode stroke={1.25} size="1rem" />} />
			</RichTextEditor.ControlsGroup>
			<RichTextEditor.ControlsGroup>
				<RichTextEditor.ColorPicker
					style={{
						background:
							'repeating-linear-gradient(45deg,rgba(0, 0, 0, 0.05),rgba(0, 0, 0, 0.05) 2px,rgba(0, 0, 0, 0.1) 2px,rgba(0, 0, 0, 0.1) 4px)',
					}}
					colors={[
						'#25262b',
						'#868e96',
						'#de291d',
						'#e64980',
						'#be4bdb',
						'#7950f2',
						'#4c6ef5',
						'#228be6',
						'#15aabf',
						'#37B24D',
						'#40c057',
						'#82c91e',
						'#d98e04',
						'#fd7e14',
					]}
				/>
				<RichTextEditor.Color color="#de291d" />
				<RichTextEditor.Color color="#d98e04" />
				<RichTextEditor.Color color="#37B24D" />
				<RichTextEditor.UnsetColor />
			</RichTextEditor.ControlsGroup>
			<RichTextEditor.ControlsGroup>
				<RichTextEditor.Link />
				<RichTextEditor.Unlink />
			</RichTextEditor.ControlsGroup>
			<RichTextEditor.ControlsGroup>
				<RichTextEditor.Control
					onClick={() => p.editor?.commands.insertContent('<span style="color: #de291d"><sup>#experimental</sup></span>')}
					aria-label="#experimental"
					title="#experimental"
				>
					<IconFlask stroke={1.25} size="1rem" />
				</RichTextEditor.Control>
				<RichTextEditor.Control
					onClick={() => p.editor?.commands.insertContent('<span style="color: #d98e04"><sup>#pre-release</sup></span>')}
					aria-label="#pre-release"
					title="#pre-release"
				>
					<IconRocket stroke={1.25} size="1rem" />
				</RichTextEditor.Control>
				<RichTextEditor.Control
					onClick={() => p.editor?.commands.insertContent('<span style="color: #37B24D"><sup>#release</sup></span>')}
					aria-label="#release"
					title="#release"
				>
					<IconCheck stroke={1.25} size="1rem" />
				</RichTextEditor.Control>
				<RichTextEditor.Control
					onClick={() => p.editor?.commands.insertContent('<span style="color: #868e96"><sup>#deprecated</sup></span>')}
					aria-label="#deprecated"
					title="#deprecated"
				>
					<IconBan stroke={1.25} size="1rem" />
				</RichTextEditor.Control>
			</RichTextEditor.ControlsGroup>

			<RichTextEditor.ControlsGroup>
				<RichTextEditor.Blockquote />
				<RichTextEditor.Hr />
				<RichTextEditor.BulletList />
				<RichTextEditor.OrderedList />
				<RichTextEditor.Subscript />
				<RichTextEditor.Superscript />
			</RichTextEditor.ControlsGroup>
			<RichTextEditor.ControlsGroup>
				<RichTextEditor.TaskList />
				<RichTextEditor.TaskListLift />
				<RichTextEditor.TaskListSink />
			</RichTextEditor.ControlsGroup>
			<RichTextEditor.ControlsGroup>
				<RichTextEditor.AlignLeft />
				<RichTextEditor.AlignCenter />
				<RichTextEditor.AlignJustify />
				<RichTextEditor.AlignRight />
			</RichTextEditor.ControlsGroup>
			<RichTextEditor.ControlsGroup>
				<RichTextEditor.Undo />
				<RichTextEditor.Redo />
			</RichTextEditor.ControlsGroup>
		</RichTextEditor.Toolbar>
	)
}
//<span style="color: rgb(240, 62, 62)"><sup>#experimental</sup></span>
