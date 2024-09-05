import type { UpdateScheme, Props } from './types';
import { sendOutput, sendOutputs, sendSignal } from '@packages/port-send';
import clone from 'just-clone';
import { dbClassVersion } from '@packages/get-dbclass-version';
import deepMerge from '@packages/deep-merge'
import type { Item } from 'types';
import { onlineManager } from '@tanstack/react-query';

function getUpdateScheme(updateScheme: UpdateScheme): UpdateScheme | boolean {
  let resultScheme: UpdateScheme = clone(updateScheme)
  resultScheme.forEach(dbClassScheme => {
    if (dbClassScheme.offlineSilent && !onlineManager.isOnline()) dbClassScheme.silent = true
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
    return
  })

  return resultScheme
}

export default {
  async update(props: Props) {
    const scheme = getUpdateScheme(props.scheme)

    sendOutput(props.noodlNode, 'updating', true)

    const startTime = log.start()
    log.info(`update props`, props)

    try {
      if (props.optimistic) {
        const queryClient = R.libs.queryClient

        if (queryClient) {
          // optimistic update
          if (Array.isArray(scheme)) scheme.map(s => queryClient.setQueriesData([], (old: any) => {
            const oldCach = old as { [dbClass: string]: { items: Item[] } }
            const dbClass = s.dbClass.split('_')[0]
            const newCache = oldCach
            let oldItems = oldCach[dbClass]?.items
            if (oldItems?.length) {
              s.items?.map(newItem => {
                oldItems = oldItems.map(oldItem => {
                  if (oldItem.id === newItem.id) oldItem = deepMerge(oldItem, newItem)
                  return oldItem
                })
              })

              newCache[dbClass].items = oldItems
            }
          }))
        }
        //@ts-ignore
        sendSignal(props.noodlNode, 'optimisticUpdated')
      }
      const data = R.libs.mutate && await R.libs.mutate({ action: 'update', scheme })

      sendOutputs(props.noodlNode, [
        { portName: 'data', value: data },
        { portName: 'updating', value: false }
      ])
      sendSignal(props.noodlNode, 'updated')

      log.info(`updated`, data)
      log.end(`update`, startTime)

    } catch (error: any) {
      R.libs.mantine?.MantineError?.('Системная ошибка!', `update error: ${error.message}`)
      log.error('update error', error)
    }
  }
}