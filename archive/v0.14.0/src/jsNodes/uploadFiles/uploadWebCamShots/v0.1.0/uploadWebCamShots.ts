import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"

function dataURLtoFile(dataurl: string, filename: string) {
    var arr: any[] = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);

    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
}

export default async function node(noodleNode: any) {
    const { envVersion, project, debug } = window.Rolder
    const uploadItems = noodleNode.inputs.uploadItems.map((f: any) => f.data)
    const uploadFolder = noodleNode.inputs.uploadFolder
    noodleNode.setOutputs({ uploading: true })
    if (debug > 0) console.time('upload Webcam shots time')

    const credentials = {
        region: 'ru-central1',
        endpoint: 'https://storage.yandexcloud.net/' + envVersion + '/' + uploadFolder,
        credentials: {
            accessKeyId: 'YCAJES4b5ZqT9Mp_Hc5_o3NdR',
            secretAccessKey: 'YCMkuACnCQfcvpZiGGAOUFsxnBC7PmZ8CKP0pA8Y'
        }
    }
    const s3 = new S3Client(credentials)

    function upload(fd: any) {
        const fileBinary = dataURLtoFile(fd.data, fd.name)
        const params = {
            Bucket: 'rolder-' + project,
            Key: fd.name,
            Body: fileBinary,
            ContentType: fd.contentType
        }
        const command = new PutObjectCommand(params)
        return s3.send(command)
    }

    Promise.all(uploadItems.map((fd: any) => upload(fd))).then(() => {
        noodleNode.setOutputs({
            uploading: false,
            uploadedUrls: uploadItems.map((fd: any) => 'https://storage.yandexcloud.net/rolder-' + project + '/' + envVersion + '/' + uploadFolder + '/' + fd.name)
        })
        noodleNode.sendSignalOnOutput('uploaded')
        if (debug > 0) console.timeEnd('upload Webcam shots time')
    })
}