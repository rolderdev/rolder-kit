import { QRCodeSVG } from 'qrcode.react'
import { HoverCard } from '@mantine/core';

export default function QRCode_v0_1_0(props: any) {
  return (
    <HoverCard shadow="md">
      <HoverCard.Target>
        <QRCodeSVG {...props} />
      </HoverCard.Target>
      <HoverCard.Dropdown>
        <QRCodeSVG {...props} size={280} />
      </HoverCard.Dropdown>
    </HoverCard>
  )
}