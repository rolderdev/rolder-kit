import { Suspense, lazy, useState } from 'react'
import { ActionIcon, Group, Switch, TextInput } from '@mantine/core'
import sizes from '../../../configurator/params/sizes'
import { IconRestore } from '@tabler/icons-react'
import SizeUnit from '../../../configurator/SizeUnit'
import React from 'react'
const Aside = lazy(() => import('../../../containers/Aside'))
const Loader = lazy(() => import('../../../containers/Loader'))
const Comp = lazy(() => import('../../../containers/Comp'))
const Configurator = lazy(() => import('../../../configurator/Configurator'))
const SizeSlider = lazy(() => import('../../../configurator/SizeSlider'))
const Image = lazy(() => import('@packages/image'))
const defaults = { width: '100%', radius: 'md', src: '../../../../../../gula.jpg', withPlaceholder: true }

export default function (props: any) {
    const [p, setProps] = useState({ ...defaults, ...props })

    return <Suspense fallback={<Loader />}>
        <Aside features={['Custom props', 'Props function', 'Scope']} scopes='Table'>
            <Comp><Image {...p} /></Comp>
            <Configurator>
                <TextInput
                    label='Source (src)'
                    defaultValue={defaults.src} onChange={v => setProps((prev: any) => ({ ...prev, src: v.target.value }))}
                />
                <Group noWrap>
                    <SizeSlider
                        name='Radius (radius)'
                        value={sizes.find(i => i.label === p.radius)?.value}
                        onChange={(v: any) => setProps((prev: any) => ({ ...prev, radius: sizes.find(i => i.value === v)?.label }))}
                    />
                    <ActionIcon mt={20} onClick={() => setProps((prev: any) => ({ ...prev, radius: defaults.radius }))}>
                        <IconRestore size={20} />
                    </ActionIcon>
                </Group>
                <SizeUnit
                    label='Width (width)'
                    defaultSize={100}
                    defaultUnit='%'
                    onChange={(size, unit) => setProps((prev: any) => ({ ...prev, width: size + unit }))}
                />
                <SizeUnit
                    label='Height (height)'
                    defaultSize={undefined}
                    defaultUnit='px'
                    onChange={(size, unit) => setProps((prev: any) => ({ ...prev, height: size ? size + unit : undefined }))}
                />
                <Switch
                    label='Placeholder (withPlaceholder)'
                    checked={p.withPlaceholder}
                    onChange={v => setProps((prev: any) => ({ ...prev, withPlaceholder: v.target.checked }))}
                />
                {p.withPlaceholder ?
                    <SizeUnit
                        label='Placeholder icon size (placeholderIconSize)'
                        defaultSize={24}
                        defaultUnit='px'
                        onChange={(size, unit) => setProps((prev: any) => ({ ...prev, placeholderIconSize: size + unit }))}
                    /> : null}
            </Configurator>
        </Aside>
    </Suspense>
}