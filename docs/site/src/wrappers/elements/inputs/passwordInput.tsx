import { Suspense, lazy, useState } from 'react'
import { ActionIcon, Code, Divider, Group, Stack, Text } from '@mantine/core'
import sizes from '../../../configurator/params/sizes'
import { IconEraser, IconRestore } from '@tabler/icons-react'
import SizeUnit from '../../../configurator/SizeUnit'
import Switch from '../../../configurator/Switch'
import TextInput from '../../../configurator/TextInput'
import { notifications } from '@mantine/notifications'
import React = require('react')
const Mantine = lazy(() => import('../../../containers/Mantine'))
const Aside = lazy(() => import('../../../containers/Aside'))
const Loader = lazy(() => import('../../../containers/Loader'))
const Comp = lazy(() => import('../../../containers/Comp'))
const Configurator = lazy(() => import('../../../configurator/Configurator'))
const SizeSlider = lazy(() => import('../../../configurator/SizeSlider'))
//@ts-ignore
const PasswordInput = lazy(() => import('@shared/password-input'))
const defaults = { label: undefined, placeholder: undefined, radius: 'md', w: '100%', withAsterisk: false, disabled: false, }

export default function (props: any) {
    const [p, setProps] = useState({ ...defaults, ...props, value: '' })

    return <Suspense fallback={<Loader />}>
        <Mantine>
            <Aside features={['Custom props', 'Props function']} scopes='Table'>
                <Comp>
                    <PasswordInput
                        {...p}
                        value={p.value}
                        onChange={(e) => setProps(prev => ({ ...prev, value: e.target.value }))}
                    />
                </Comp>
                <Configurator w={340}>
                    <TextInput
                        label='Label (label)'
                        default={defaults.label}
                        onChange={v => setProps(prev => ({ ...prev, label: v.target.value }))}
                    />
                    <TextInput
                        label='Placeholder (placeholder)'
                        default={defaults.placeholder}
                        onChange={v => setProps(prev => ({ ...prev, placeholder: v.target.value }))}
                    />
                    <Group noWrap>
                        <SizeSlider
                            name='Radius (radius)'
                            value={sizes.find(i => i.label === p.radius).value}
                            onChange={v => setProps(prev => ({ ...prev, radius: sizes.find(i => i.value === v).label }))}
                        />
                        <ActionIcon mt={20} onClick={() => setProps(prev => ({ ...prev, radius: defaults.radius }))}>
                            <IconRestore size={20} />
                        </ActionIcon>
                    </Group>
                    <SizeUnit
                        label='Width (w)'
                        defaultSize={100}
                        defaultUnit='%'
                        onChange={(size, unit) => setProps(prev => ({ ...prev, w: size + unit }))}
                    />
                    <Switch
                        label='With asterisk (withAsterisk)'
                        default={defaults.withAsterisk}
                        onChange={v => setProps(prev => ({ ...prev, withAsterisk: v.target.checked }))}
                    />
                    <Switch
                        label='Disabled (disabled)'
                        default={defaults.disabled}
                        onChange={v => setProps(prev => ({ ...prev, disabled: v.target.checked }))}
                    />
                    <Switch
                        label='Error (error)'
                        default={false}
                        onChange={v => setProps(prev => ({ ...prev, error: v.target.checked }))}
                    />
                    <TextInput
                        label='Error (error)'
                        onChange={v => setProps(prev => ({ ...prev, error: v.target.value }))}
                    />
                    <Divider label='Outputs' />
                    <Stack>
                        <Text>Typed value (typedValue)</Text>
                        <Code mih={26} >{p.value}</Code>
                    </Stack>
                    <Divider label='Signals' />
                    <Group>
                        <Text>Reset</Text>
                        <ActionIcon
                            radius='md'
                            size='lg'
                            color='blue'
                            onClick={() => {
                                setProps(prev => ({ ...prev, value: '' }))
                                notifications.show({ message: 'Output signal: "Reseted"' })
                            }}
                        >
                            <IconEraser />
                        </ActionIcon>
                    </Group>
                </Configurator>
            </Aside>
        </Mantine>
    </Suspense>
}