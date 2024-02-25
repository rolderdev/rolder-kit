import { forwardRef, useCallback, useImperativeHandle, useRef, useState } from "react"
import { Props } from "./types"
import React from "react"
import { sendOutput, sendSignal } from "@shared/port-send";
import Webcam from "react-webcam";


export default forwardRef(function (props: Props, ref) {

    const [cameraId, setCameraId] = useState({});
    const handleCameraId = () => {
        navigator.mediaDevices.enumerateDevices().then(cameras => {
            const cams = cameras.filter(({ kind }: { kind: string }) => kind === "videoinput")
            setCameraId(cams[cams.length - 1].deviceId)
        })
    }

    const webcamRef = useRef<any>(null);
    useImperativeHandle(ref, () => ({
        takeScreenshot() {
            const imageSrc = webcamRef.current.getScreenshot()
            sendOutput(props.noodlNode, 'screenshot', imageSrc)
            sendSignal(props.noodlNode, 'screenshoted')
        }
    }), [webcamRef])

    return <>
        <Webcam
            ref={webcamRef}
            audio={false}
            width='100%'
            style={{ position: 'absolute' }}
            videoConstraints={{ deviceId: cameraId, facingMode: { ideal: 'enviroment' } }}
            onUserMedia={handleCameraId}
            {...props as any}
        />
    </>
})