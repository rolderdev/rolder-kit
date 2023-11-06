import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"

function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);

    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
}

export default async function node(noodleNode) {
    const { envVersion, project, debug } = Rolder
    const filesData = noodleNode.inputs.filesData.map(f => f.data)
    const folder = noodleNode.inputs.folder
    noodleNode.setOutputs({ isUploading: true })
    if (debug > 0) console.time('upload Webcam shots time')

    const credentials = {
        region: 'ru-central1',
        endpoint: 'https://storage.yandexcloud.net/' + envVersion + '/' + folder,
        credentials: {
            accessKeyId: 'YCAJES4b5ZqT9Mp_Hc5_o3NdR',
            secretAccessKey: 'YCMkuACnCQfcvpZiGGAOUFsxnBC7PmZ8CKP0pA8Y'
        }
    }
    const s3 = new S3Client(credentials)

    function upload(fd) {
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

    Promise.all(filesData.map(fd => upload(fd))).then(() => {
        noodleNode.setOutputs({
            isUploading: false,
            uploadedUrls: filesData.map(fd => 'https://storage.yandexcloud.net/rolder-' + project + '/' + envVersion + '/' + folder + '/' + fd.name)
        })
        noodleNode.sendSignalOnOutput('sendUploaded')
        if (debug > 0) console.timeEnd('upload Webcam shots time')
    })
}