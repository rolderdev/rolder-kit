import ky from 'ky'
import { Props } from './types';
import { sendOutput, sendSignal } from '@shared/port-send';
import fetch from './src/fetch';

export default {
  async getData(props: Props) {
    const { project, backendVersion } = window.R.env
    const { noodlNode, flowEndpoint, flowData } = props

    const { dbName } = R.env
    if (!dbName) {
      R.libs.mantine?.MantineError?.('Системная ошибка!', `No dbName at R.env`)
      log.error('No dbName', R.env)
      return null
    }


    if (flowEndpoint) {
      const startTime = log.start()

      log.info(`Nodered ${flowEndpoint} props`, { flowEndpoint, flowData })
      //@ts-ignore
      sendOutput(noodlNode, 'executing', true)

      const credsResp: any = await fetch({ dbName: 'config', dbClass: 'creds_v1', query: { in: { name: ['nodered'] } } })

      if (credsResp?.length) {
        const noderedCreds = credsResp.find((i: any) => i.name === 'nodered')?.data
        if (noderedCreds) {
          const formData = new FormData()
          if (flowData) {
            if (flowData.params) formData.append('params', JSON.stringify(flowData.params))
            if (flowData.data) formData.append('data', JSON.stringify(flowData.data))
            if (flowData.files) flowData.files.map(i => formData.append(i.name, i))

            const json = await ky.post(`https://${project}.nodered.${backendVersion}.rolder.app/${flowEndpoint}`, {
              headers: {
                Authorization: 'Basic ' + btoa(`${noderedCreds.username}:${noderedCreds.password}`),
              },
              body: formData
            }).json()
            //@ts-ignore
            sendOutput(noodlNode, 'result', json)
            //@ts-ignore
            sendOutput(noodlNode, 'executing', false)
            //@ts-ignore
            sendSignal(noodlNode, 'executed')


            log.info(`Nodered ${flowEndpoint}`, json)
            log.end(`Nodered: ${flowEndpoint}`, startTime)
          }
        }
      }
    }
  }
}