import { useRef, useCallback } from 'react'
import Webcam from "react-webcam"
import { Button, Group } from '@mantine/core'

export default function WebCamera_v0_1_0(props) {
  const webcamRef = useRef(null)
  const videoConstraints = {
    facingMode: { exact: "environment" }
  }

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot()
    props.screenshot(imageSrc)
    props.sendScreenshot()
  }, [webcamRef])

  return (
    <>
      <Webcam
        ref={webcamRef}
        audio={false}
        videoConstraints={videoConstraints}
        screenshotFormat="image/jpeg"
        {...props}
      />
      <Group position='center' >
        <Button
          mt={-144}
          radius={80}
          w={80}
          h={80}
          size='xl'
          sx={(theme) => ({
            borderWidth: 6,
            backgroundColor: theme.colors.red,
            opacity: 0.5,
            borderColor: '#fff',
            '&:active': {
              opacity: 1,
            },
          })}
          onClick={capture}
        />
      </Group>
    </>
  )
}