import { forwardRef, useImperativeHandle, useRef, useState } from "react"
import Webcam from "react-webcam";
import type { Props } from "./types";
import { sendOutput, sendSignal } from "@packages/port-send";
import { IconCamera, IconCameraX } from "@tabler/icons-react";
import { Center, Stack, Text } from "@mantine/core";

export default forwardRef(function (props: Props, ref) {
    const { noodlNode } = props

    const [cameraState, setCameraState] = useState<'connecting' | 'connected' | string>('connecting')
    const webcamRef = useRef<any>(null);
    const [cameraId, setCameraId] = useState({})

    const handleCameraId = () => {
        navigator.mediaDevices.enumerateDevices().then(cameras => {
            const cams = cameras.filter(({ kind }: { kind: string }) => kind === "videoinput")
            setCameraId(cams[cams.length - 1].deviceId)
            setCameraState('connected')
            // Нужно подождать, чтобы разработчик не отображал интерфейс раньше чем появился поток камеры
            if (cameraState) setTimeout(() => sendOutput(noodlNode, 'connected', true), 500)
        })
    }

    useImperativeHandle(ref, () => ({
        shoot() {
            const photoSrc = webcamRef.current.getScreenshot()
            sendOutput(noodlNode, 'dataUri', photoSrc)
            sendSignal(noodlNode, 'shot')
        }
    }), [webcamRef])

    return <>
        {cameraState === 'connecting'
            ? <Center p={24} mih={240}>
                <Stack align="center">
                    <IconCamera size={48} />
                    <Text>Подключение камеры</Text>
                </Stack>
            </Center>
            : null
        }
        {cameraState !== 'connecting' && cameraState !== 'connected'
            ? <Center p={24} mih={240}>
                <Stack align="center">
                    <IconCameraX size={48} color="red" />
                    <Text>Ошибка подключения камеры</Text>
                    <Text>{cameraState}</Text>
                </Stack>
            </Center>
            : null
        }
        <Webcam
            ref={webcamRef}
            audio={false}
            width='100%'
            height={cameraState === 'connected' ? undefined : 0}
            videoConstraints={{ deviceId: cameraId, facingMode: { ideal: 'enviroment' } }}
            onUserMedia={(stream) => {
                if (stream.active) {
                    handleCameraId()
                }
            }}
            onUserMediaError={(e) => {
                // Покажем ошибку прямо в интерфейс
                setCameraState(e.toString())
            }}
        />
    </>
})