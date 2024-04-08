import { forwardRef } from "react" //
import { Group, Stack, Text } from '@mantine/core'; // rem
import icons from "../../../../../../../libs/icons/v0.2.0/icons"
import { sendOutput, sendSignal } from "../../../../../../../libs/nodesFabric/v0.1.0/send/v0.4.0/send"
import { Dropzone } from '@mantine/dropzone'; //
import { log } from "../../../../../../../utils/debug/log/v0.2.0/log";

export default forwardRef(function (props: any) {
  const AcceptIcon = icons(props.acceptIconName)
  const RejectIcon = icons(props.rejectIconName)
  const IdleIcon = icons(props.idleIconName)
  const dropZoneTitle = props.dropZoneTitle

  function handleFileType(acceptedType: '*' | 'pdf' | 'excel' | 'image'): string | { [key: string]: string[] } {
    if (acceptedType === 'pdf') {
      return { 'application/pdf': ['.pdf'] }
    }
    else if (acceptedType === 'excel') {
      return {
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
        'application/vnd.ms-excel': ['.xls'],
        'application/vnd.oasis.opendocument.spreadsheet': ['.ods']
      }
    }
    else if (acceptedType === 'image') {
      return {
        'image/*': [],
        'application/pdf': ['.pdf']
      }
    }
    else {
      return '*'
    }
  }

  return (
    <Dropzone
      onDrop={(files) => {                                        // Принятие файла
        sendOutput(props.noodlNode, 'file', files[0])
        sendOutput(props.noodlNode, 'fileName', files[0].name)
        sendSignal(props.noodlNode, 'loaded')
        log('accepted files by DropZone', files[0])               // логи от Rolder-Kit
      }}
      onReject={(files) => {                                      // Отвержение файла
        sendSignal(props.noodlNode, 'rejected')
        log('rejected files by DropZone', files)
      }}
      maxSize={3 * 1024 ** 2}                                     // Размер файла в байтах
      accept={handleFileType(props.acceptedType)}                 // Тип принимаемого файла
      {...props}                                                  // porops от родителя
      {...props.customProps}
    >
      <Group position="center" align="center" spacing="xl" style={{ minHeight: '180px', pointerEvents: 'none' }}> {/* style={{ minHeight: rem(220), pointerEvents: 'none' }} */}

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
})

