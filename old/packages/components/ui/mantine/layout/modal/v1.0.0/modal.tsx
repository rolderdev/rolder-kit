import { Modal, Title } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { sendSignal } from '@packages/port-send'
import { forwardRef, useImperativeHandle } from 'react'
import type { Props } from './types'

export default forwardRef((props: Props, ref) => {
	const [opened, { open, close }] = useDisclosure(false)
	useImperativeHandle(
		ref,
		() => ({
			open() {
				open()
			},
			close() {
				close()
			},
		}),
		[]
	)

	return (
		<Modal.Root
			centered
			size={props.sizeUnits || props.sizePresets}
			opened={opened}
			onClose={() => {
				close()
				sendSignal(props.noodlNode, 'closed')
			}}
			{...props}
			{...props.customProps}
		>
			<Modal.Overlay opacity={props.modalOpacity} blur={props.modalBlur} />
			<Modal.Content>
				{props.modalHeaderEnabled && (
					<Modal.Header>
						{props.modalTitle && (
							<Modal.Title>
								<Title order={props.modalTitleOrder}>{props.modalTitle}</Title>
							</Modal.Title>
						)}
						{props.closeActionEnabled && <Modal.CloseButton sx={{ alignSelf: 'flex-start' }} />}
					</Modal.Header>
				)}
				<Modal.Body>{props.children}</Modal.Body>
			</Modal.Content>
		</Modal.Root>
	)
})
