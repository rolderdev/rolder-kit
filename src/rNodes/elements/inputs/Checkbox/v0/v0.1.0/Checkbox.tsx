import { forwardRef, useImperativeHandle } from 'react'
import { MRT_DensityState, MRT_TableContainer, } from 'mantine-react-table';

import { DefaultMantineColor, Checkbox } from '@mantine/core';
import { NodeInstance } from '@noodl/noodl-sdk';

const Comp = forwardRef(function (props: { noodlNode?: NodeInstance, color: DefaultMantineColor }) {
  const { noodlNode } = props

  return (
    <Checkbox
      onChange={(e) => {
        if (noodlNode) {
          noodlNode.outputPropValues.checked = e.currentTarget.checked
          noodlNode.flagOutputDirty('checked')
        }
      }}
      {...props}
    />
  )
})

export default Comp