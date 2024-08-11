import type { CreateScheme, Props } from './types';
import { sendOutput, sendSignal } from '@packages/port-send';
import clone from 'just-clone';
import { dbClassVersion } from '@packages/get-dbclass-version';

function getCreateScheme(createScheme: CreateScheme): CreateScheme | boolean {
  let resultScheme: CreateScheme = clone(createScheme)
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
  async create(props: Props) {
    const scheme = getCreateScheme(props.scheme)

    sendOutput(props.noodlNode, 'creating', true)

    const startTime = log.start()
    log.info(`create props`, { scheme })

    try {
      const data = R.libs.mutate && await R.libs.mutate({ action: 'create', scheme })

      //@ts-ignore
      sendOutput(props.noodlNode, `data`, data)
      sendOutput(props.noodlNode, 'creating', false)
      sendSignal(props.noodlNode, 'created')

      log.info(`created`, data)
      log.end(`create`, startTime)

    } catch (error: any) {
      R.libs.mantine?.MantineError?.('Системная ошибка!', `create error: ${error.message}`)
      log.error('create error', error)
    }
  }
}