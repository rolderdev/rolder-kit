import ky from 'ky'
import fetch from '../../../../../libs/fetch/v0.5.0/fetch';
import { sendOutput, sendSignal } from '../../../../../../../libs/nodesFabric/v0.1.0/send/v0.4.0/send';
import { log, time } from '../../../../../../../utils/debug/log/v0.2.0/log';

export default {
  signals: {
    execute: async (noodlNode: NoodlNode) => {
      const { project, backendVersion } = window.R.env
      const { flowEndpoint, flowData } = noodlNode.resultProps as { flowEndpoint: string, flowData: FlowData1 }

      if (flowEndpoint) {
        time(`Nodered ${flowEndpoint}`)
        log(`Nodered ${flowEndpoint} props`, { flowEndpoint, flowData })
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

              sendOutput(noodlNode, 'result', json)
              sendOutput(noodlNode, 'executing', false)
              sendSignal(noodlNode, 'executed')

              time(`Nodered ${flowEndpoint}`, true)
              log(`Nodered ${flowEndpoint}`, json)
            }
          }
        }
      }
    }
  }
}