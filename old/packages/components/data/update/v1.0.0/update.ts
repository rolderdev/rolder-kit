import type { UpdateScheme, Props } from './types';
import { sendOutput, sendSignal } from '@packages/port-send';
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
      if (!onlineManager.isOnline() || props.optimistic) {
        const queryClient = R.libs.queryClient

        if (queryClient) {
          // Cancel current queries for the todos list
          //await queryClient.cancelQueries([])

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