//@ts-ignore
import { defineNode } from '@noodl/noodl-sdk'

import getQrCodeNode from '@nodes/get-qr-code'

const nodes = [getQrCodeNode]

import qrCodeNode from '@nodes/qr-code'
import qrScannerNode from '@nodes/qr-scanner'

const reactNodes = [qrCodeNode, qrScannerNode]

Noodl.defineModule({ reactNodes, nodes: nodes.map((i) => defineNode(i)) })
