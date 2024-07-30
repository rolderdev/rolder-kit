import { forwardRef, useEffect, useState } from 'react';
import type { Props } from './types';
import { sendOutput, sendSignal } from '@packages/port-send';
import { Html5Qrcode, type Html5QrcodeFullConfig, Html5QrcodeSupportedFormats } from 'html5-qrcode';

export default forwardRef(function (props: Props) {
	const [qrString, setQrString] = useState<string | undefined>(undefined);
	const [prevQrString, setPrevQrString] = useState<string | undefined>(undefined);

	useEffect(() => {
		if (qrString !== prevQrString) {
			setPrevQrString(qrString);
			//@ts-ignore
			sendOutput(props.noodlNode, 'qrString', qrString);
			//@ts-ignore
			sendSignal(props.noodlNode, 'qrScanned');
		}
	}, [qrString]);

	useEffect(() => {
		let html5QrCodeF: any;
		const config: Html5QrcodeFullConfig = {
			verbose: false,
			formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
		};
		Html5Qrcode.getCameras()
			.then((devices) => {
				if (devices && devices.length) {
					var cameraId = devices[devices.length - 1].id;
					const html5QrCode = new Html5Qrcode('Html5Qrcode', config);
					html5QrCode
						.start(
							cameraId,
							{
								fps: props.maxScansPerSecond,
								qrbox: 250,
							},
							(decodedText) => {
								if (qrString !== decodedText) {
									setQrString(decodedText);
								}
							},
							() => {}
						)
						.catch((err) => log.error('QRScanner', err));
					html5QrCodeF = html5QrCode;
				}
			})
			.catch((err) => log.error('QRScanner error', err));
		return () => {
			try {
				html5QrCodeF?.stop();
			} catch (error) {}
		};
	}, []);

	return <div id={'Html5Qrcode'} />;
});
