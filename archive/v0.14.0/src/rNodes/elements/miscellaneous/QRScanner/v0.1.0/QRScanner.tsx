import { useShallowEffect } from '@mantine/hooks';
import { Html5QrcodeFullConfig } from 'html5-qrcode';
import { useState } from 'react';

export default function QRScanner_v0_1_0(props: any) {
  const [qrString, setQrString] = useState<string | undefined>(undefined)
  const [prevQrString, setPrevQrString] = useState<string | undefined>(undefined)

  useShallowEffect(() => {
    if (qrString !== prevQrString) {
      setPrevQrString(qrString)
      props.qrString(qrString)
      props.qrScanned()
    }
  }, [qrString])

  useShallowEffect(() => {
    let html5QrCodeF: any
    import('html5-qrcode').then(module => {
      const { Html5Qrcode, Html5QrcodeSupportedFormats } = module
      const config: Html5QrcodeFullConfig = {
        verbose: false,
        formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
      }
      Html5Qrcode.getCameras().then(devices => {
        if (devices && devices.length) {
          var cameraId = devices[devices.length - 1].id;
          const html5QrCode = new Html5Qrcode('Html5Qrcode', config);
          html5QrCode.start(
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
            .catch((err) => {
              // Start failed, handle it.
              console.log('tart failed', err)
            });
          html5QrCodeF = html5QrCode
        }
      }).catch(err => {
        // handle err
        console.log('handle err', err)
      });
    })

    return () => {
      html5QrCodeF.stop().then(() => {
        // QR Code scanning is stopped.
        //console.log('stop', ignore)
      }).catch(() => {
        // Stop failed, handle it.
      });
    }
  }, []);

  return (
    <div id={'Html5Qrcode'} />
  );
};