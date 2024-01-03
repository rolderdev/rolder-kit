import { useShallowEffect } from "@mantine/hooks"
import { Html5Qrcode, Html5QrcodeFullConfig, Html5QrcodeSupportedFormats } from "html5-qrcode"
import { forwardRef, useState } from "react"
import { sendOutput, sendSignal } from '@rk/node-fabrik'

export default forwardRef(function (props: any) {
    const [qrString, setQrString] = useState<string | undefined>(undefined)
    const [prevQrString, setPrevQrString] = useState<string | undefined>(undefined)

    useShallowEffect(() => {
        if (qrString !== prevQrString) {
            setPrevQrString(qrString)
            sendOutput(props.noodlNode, 'qrString', qrString)
            sendSignal(props.noodlNode, 'qrScanned')
        }
    }, [qrString])

    useShallowEffect(() => {
        let html5QrCodeF: any
        const config: Html5QrcodeFullConfig = {
            verbose: false,
            formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
        }
        Html5Qrcode.getCameras().then(devices => {
            if (devices && devices.length) {
                var cameraId = devices[devices.length - 1]?.id;
                const html5QrCode = new Html5Qrcode('Html5Qrcode', config);
                if (cameraId) html5QrCode.start(
                    cameraId,
                    {
                        fps: props.maxScansPerSecond,
                        qrbox: 250,
                    },
                    (decodedText) => {
                        if (qrString !== decodedText) {
                            setQrString(decodedText)
                        }
                    },
                    () => { })
                    .catch((err) => console.log('start failed', err))
                html5QrCodeF = html5QrCode
            }
        }).catch(err => console.log('handle err', err))
        return () => html5QrCodeF.stop()
    }, []);

    return (
        <div id={'Html5Qrcode'} />
    )
})