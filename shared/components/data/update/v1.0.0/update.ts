import { UpdateScheme, Props } from './types';
import { sendOutput, sendSignal } from '@shared/port-send';
import clone from 'just-clone';
import { dbClassVersion } from '@shared/get-dbclass-version';

function getUpdateScheme(updateScheme: UpdateScheme): UpdateScheme | boolean {
  let resultScheme: UpdateScheme = clone(updateScheme)
  resultScheme.forEach(dbClassScheme => {
    const dbClass = dbClassVersion(dbClassScheme.dbClass)
    if (dbClass) dbClassScheme.dbClass = dbClass
    else {
      R.libs.mantine?.MantineError?.('Системная ошибка!', `No dbClass at scheme: ${JSON.stringify(dbClassScheme)}`)
      log.error('`No dbClass at scheme', dbClassScheme)
      return false
    }
    if (!dbClassScheme.items && !dbClassScheme.itemsFunc) {
      R.libs.mantine?.MantineError?.('Системная ошибка!', `No items or itemsFunc at scheme: ${JSON.stringify(dbClassScheme)}`)
      log.error('No items or itemsFunc at scheme', dbClassScheme)
      return false
    }
  })

  return resultScheme
}

export default {
  async update(props: Props) {
    const scheme = getUpdateScheme(props.scheme)

    sendOutput(props.noodlNode, 'updating', true)

    const startTime = log.start()
    log.info(`update props`, { scheme })

    try {
      const data = R.libs.mutate && await R.libs.mutate({ action: 'update', scheme })

      //@ts-ignore
      sendOutput(props.noodlNode, `data`, data)
      sendOutput(props.noodlNode, 'updating', false)
      sendSignal(props.noodlNode, 'updated')

      log.info(`updated`, data)
      log.end(`update`, startTime)

    } catch (error: any) {
      R.libs.mantine?.MantineError?.('Системная ошибка!', `update error: ${error.message}`)
      log.error('update error', error)
    }
  }
}