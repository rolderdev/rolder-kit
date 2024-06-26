import ky from 'ky'
import type { Props } from './types';
import { sendOutput, sendSignal } from '@packages/port-send';

export default {
  async execute(props: Props) {
    const { project, backendVersion } = window.R.env
    const { noodlNode, flowEndpoint, flowData, timeout, useRadFlow } = props

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

      const noderedCreds = R.params.creds?.filter(i => i.name === 'nodered')?.[0].data
      if (noderedCreds) {
        const formData = new FormData()
        if (flowData) {
          if (flowData.params) formData.append('params', JSON.stringify(flowData.params))
          if (flowData.data) formData.append('data', JSON.stringify(flowData.data))
          if (flowData.files) flowData.files.map(i => formData.append(i.name, i))
        }

        let nodeRedUrl = ""
        console.log("00000000000000000000000000000000000000000000000000000000000000000000000")
        console.log("nodeRedUrl до проверки", nodeRedUrl)

        
        // Если флаг useRadFlow, то используем поток из rad
        if (useRadFlow) {
          nodeRedUrl = `https://nodered.rad.rolder.app/${flowEndpoint}`
        }
        else {
          nodeRedUrl = `https://${project}.nodered.${backendVersion}.rolder.app/${flowEndpoint}`
        }

        console.log("nodeRedUrl после проверки", nodeRedUrl)

        const jsonResp = await ky.post(nodeRedUrl, {
          headers: {
            Authorization: 'Basic ' + btoa(`${noderedCreds.username}:${noderedCreds.password}`),
          },
          body: formData,
          timeout: timeout, // Vezdexod
        }).json()

        //@ts-ignore
        sendOutput(noodlNode, 'result', jsonResp)
        //@ts-ignore
        sendOutput(noodlNode, 'executing', false)
        //@ts-ignore
        sendSignal(noodlNode, 'executed')

        log.info(`Nodered ${flowEndpoint}`, jsonResp)
        log.end(`Nodered: ${flowEndpoint}`, startTime)
      }

    }
  }
}