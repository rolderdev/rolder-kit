import type { CreateScheme, CreateUser, Props } from './types';
import { sendOutput, sendSignal } from '@packages/port-send';
import unique from 'just-unique';
import map from 'just-map-object';
import isEmpty from '@packages/is-empty';
import mCreate from './src/mCreate';
import createUser from './src/createUser';
import type { Item } from 'types';

export default {
  async create(props: Props) {
    const { noodlNode, createScheme } = props

    sendOutput(noodlNode, 'creating', true)

    const orders = unique(createScheme.map(i => i.order)).sort()
    const createPromise = (scheme: CreateScheme) => mCreate(scheme)
    const createUserPromise = (scheme: CreateUser) => createUser(scheme)
    const schemeArrays = orders.map(order => {
      return createScheme.filter(i => i.order === order)
    })

    async function executeArrays() {
      let results: any = {};
      for (const schemeArray of schemeArrays) {
        const arrayResults = await Promise.all(schemeArray.map((scheme: CreateScheme) => {
          // save refId for next order            
          // @ts-ignore
          if (scheme.items.some(i => !isEmpty(i.refId))) {
            //@ts-ignore
            results[scheme.dbClass] = scheme.items.map(i => ({ refId: i.refId }))
            scheme.items = scheme.items.map(i => {
              //@ts-ignore
              delete i.refId
              return i
            })
          }
          // add ref from prev order            
          scheme.items.forEach((item: any) => {
            map(item, (k, v: any) => {
              if (!isEmpty(v.refId)) {
                const refId = results[k]?.find((i: any) => i.refId === v.refId)?.id
                if (refId) item[k] = { id: refId }
                delete v.refId
              }
            })
          })
          if (scheme.dbClass === 'user') return Promise.all(scheme.items.map((user: any, idx) => createUserPromise(user).then(user => ({
            ...user, refId: results[scheme.dbClass]?.[idx].refId
          }))))
          else return createPromise(scheme).then(items => items?.map((i, idx) => ({
            ...i, refId: results[scheme.dbClass]?.[idx].refId
          })))
        }))

        schemeArray.forEach((scheme: CreateScheme, idx: number) => results[scheme.dbClass] = arrayResults[idx])
      }

      map(results, (dbClass, items: Item[]) => {
        results[dbClass] = items.map(i => {
          //@ts-ignore
          delete i.refId
          return i
        })
      })

      //@ts-ignore
      sendOutput(noodlNode, 'createdData', results)
      sendSignal(noodlNode, 'created')
      sendOutput(noodlNode, 'creating', false)
    }

    executeArrays().catch((error) => log.error('create error', error))
  }
}