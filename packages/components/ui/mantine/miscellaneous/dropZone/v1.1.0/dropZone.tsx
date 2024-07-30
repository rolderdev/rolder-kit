import { forwardRef } from 'react'; //
import { Group, Stack, Text } from '@mantine/core';
import { Dropzone, type DropzoneProps } from '@mantine/dropzone';
import type { Props } from './types';
import { sendOutput, sendSignal } from '@packages/port-send';

export default forwardRef(function (props: Props) {
	const AcceptIcon = props.acceptIconName && R.libs.icons[props.acceptIconName];
	const RejectIcon = props.rejectIconName && R.libs.icons[props.rejectIconName];
	const IdleIcon = props.idleIconName && R.libs.icons[props.idleIconName];
	const dropZoneTitle = props.dropZoneTitle;

	function handleFileType(acceptedType: Props['acceptedType']): DropzoneProps['accept'] {
		// Типы файлов подаются через запятую.
		// Выделим их в массив
		const acceptedTypeList = acceptedType.split(', ');

		// И сформируем словарь для определения типа
		const selectedTypes: { [key: string]: any } = {};

		for (const iType of acceptedTypeList) {
			if (iType === '.pdf') {
				selectedTypes['application/pdf'] = ['.pdf'];
			}
			if (['.xlsx', '.xls', '.ods'].includes(iType)) {
				selectedTypes['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'] = ['.xlsx'];
				selectedTypes['application/vnd.ms-excel'] = ['.xls'];
				// selectedTypes["application/vnd.oasis.opendocument.spreadsheet"] = [".ods"]ы
			}
			if (['.png', '.jpg', '.jpeg'].includes(iType)) {
				selectedTypes['image/*'] = [];
			}
		}
		return selectedTypes;
	}

	return (
		<Dropzone
			onDrop={(files) => {
				// Принятие файла
				// @ts-ignore
				sendOutput(props.noodlNode, 'file', files[0]);
				sendOutput(props.noodlNode, 'fileName', files[0].name);
				// @ts-ignore
				sendSignal(props.noodlNode, 'loaded');
				log.info('accepted files by DropZone', files[0]); // логи от Rolder-Kit
			}}
			onReject={(files) => {
				// Отвержение файла
				// @ts-ignore
				sendSignal(props.noodlNode, 'rejected');
				log.info('rejected files by DropZone', files);
			}}
			maxSize={20 * 1024 ** 2} // Размер файла в байтах
			accept={handleFileType(props.acceptedType)} // Тип принимаемого файла
			{...props} // porops от родителя
			{...props.customProps}
		>
			<Group position="center" align="center" spacing="xl" style={{ minHeight: '180px', pointerEvents: 'none' }}>
				{' '}
				{/* style={{ minHeight: rem(220), pointerEvents: 'none' }} */}
				{/* Нейтральное состояние */}
				<Dropzone.Idle>
					<Stack align="center" justify="center">
						<IdleIcon size={props.iconSize} stroke={props.stroke} />
						<Text size="md" color="dimmed" inline>
							{dropZoneTitle}
						</Text>
					</Stack>
				</Dropzone.Idle>
				{/* Файл подходит */}
				<Dropzone.Accept>
					<Stack align="center" justify="center">
						<AcceptIcon size={props.iconSize} stroke={props.stroke} />
						<Text size="md" color="dimmed" inline>
							{dropZoneTitle}
						</Text>
					</Stack>
				</Dropzone.Accept>
				{/* Файл не подходит */}
				<Dropzone.Reject>
					<Stack align="center" justify="center">
						<RejectIcon size={props.iconSize} stroke={props.stroke} />
						<Text size="md" color="dimmed" inline>
							{dropZoneTitle}
						</Text>
					</Stack>
				</Dropzone.Reject>
			</Group>
		</Dropzone>
	);
});
