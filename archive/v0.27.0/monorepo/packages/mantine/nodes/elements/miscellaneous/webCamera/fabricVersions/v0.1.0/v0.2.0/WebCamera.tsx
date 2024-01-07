import { Button, Group } from "@mantine/core";
import { forwardRef, useCallback, useRef, useState } from "react"
import Webcam from "react-webcam";
import { sendOutput, sendSignal } from "../../../../../../../../../libs/nodesFabric/v0.1.0/send/v0.4.0/send";

export default forwardRef(function (props: any) {
    const [cameraId, setCameraId] = useState({});
    const handleCameraId = () => {
        navigator.mediaDevices.enumerateDevices().then(cameras => {
            const cams = cameras.filter(({ kind }: { kind: string }) => kind === "videoinput")
            setCameraId(cams[cams.length - 1].deviceId)
        })
    }

    const webcamRef = useRef<any>(null);
    const capture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot()
        sendOutput(props.noodlNode, 'screenshot', imageSrc)
        sendSignal(props.noodlNode, 'screenshoted')        
    }, [webcamRef])

    return <>
        <Webcam
            ref={webcamRef}
            audio={false}
            width='100%'
            videoConstraints={{ deviceId: cameraId, facingMode: { ideal: 'enviroment' } }}
            onUserMedia={handleCameraId}
        />
        {props.screenshotEnabled && <Group w='100%' h='100%' position='center' >
            <Button
                mt={-144}
                radius={80}
                w={80}
                h={80}
                size='xl'
                sx={(theme) => ({
                    borderWidth: 6,
                    backgroundColor: theme.colors[props.buttonColor],
                    opacity: 0.5,
                    borderColor: '#fff',
                    '&:active': {
                        opacity: 1,
                    },
                })}
                onClick={capture}
            />
        </Group>}
    </>
})