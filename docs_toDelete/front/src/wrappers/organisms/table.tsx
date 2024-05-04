import { Suspense, lazy, useState } from 'react'
import { ActionIcon, Button, Divider, Group, Modal, Select, Stack, Text, Textarea, Title } from '@mantine/core'
import React from 'react'
import { useDisclosure, useForceUpdate } from '@mantine/hooks'
import UseData from '@packages/use-data'
import Data from '../../containers/Data'
import useOutputs from '../../hooks/useOutputs'
import App from '../../containers/App'
import SizeUnit from '../../configurator/SizeUnit'
import Switch from '../../configurator/Switch'
import { IconRestore } from '@tabler/icons-react'
const Mantine = lazy(() => import('../../containers/Mantine'))
const Aside = lazy(() => import('../../containers/Aside'))
const Loader = lazy(() => import('../../containers/Loader'))
const Comp = lazy(() => import('../../containers/Comp'))
const Configurator = lazy(() => import('../../configurator/Configurator'))
const Table = lazy(() => import('@packages/table'))

const onRowClickTypes = [
    { value: 'disabled', label: 'Disabled' },
    { value: 'singleSelection', label: 'Single selection' },
    { value: 'expansion', label: 'Expansion' }
]

const useDataProps = {
    children: undefined,
    style: undefined,
    fetchScheme: [
        {
            dbClass: 'car',
            size: 20,
            sorts: ['content.name']
        }
    ],
}

const defaults = {
    table2Columns: [
        {
            accessor: 'content.name',
            title: 'Название',
            noWrap: true
        },
        {
            accessor: 'content.year',
            title: 'Год'
        },
        {
            accessor: 'content.horsepower',
            title: 'Лошадей'
        },
        {
            accessor: 'content.cylinders',
            title: 'Цилиндров'
        },
        {
            accessor: 'content.acceleration',
            title: 'Ускорение'
        },
        {
            accessor: 'content.origin',
            title: 'Страна'
        },
    ],
    table2OnRowClick: 'disabled',
    fitWidthContent: true,
}

export default function (props: any) {
    const [p, setProps] = useState({ ...defaults, ...props })

    const forcUpdate = useForceUpdate()
    const { noodlNode, outputValues } = useOutputs(forcUpdate)

    const [opened, { open, close }] = useDisclosure(false)

    const [columnsString, setClumnsString] = useState(JSON.stringify(p.table2Columns, null, 1))
    const [schemeButtonColor, setSchemeButtonColor] = useState('blue')

    return <Suspense fallback={<Loader />}>
        <App>
            <Mantine>
                <Data backendDevMode={false}>
                    <UseData {...useDataProps as any} noodlNode={noodlNode} />
                </Data>
                <Aside features={['Custom props', 'Props function']} scopes='Table'>
                    <Comp>
                        <Table
                            {...p} table2Items={outputValues.carItems || []}
                        />
                    </Comp>
                    <Configurator w={350}>
                        <Button variant='outline' onClick={open}>Columns</Button>
                        <Divider label='Params' />
                        <Group noWrap>
                            <Select
                                w={'100%'}
                                label='On row click (table2OnRowClick)'
                                data={onRowClickTypes}
                                value={p.table2OnRowClick}
                                onChange={(v: any) => setProps((prev: any) => ({ ...prev, table2OnRowClick: onRowClickTypes.find(i => i.value === v)?.value }))}
                            />
                            <ActionIcon onClick={() => setProps((prev: any) => ({ ...prev, table2OnRowClick: defaults.table2OnRowClick }))}>
                                <IconRestore size={20} />
                            </ActionIcon>
                        </Group>
                        <Divider label='Dimensions' />
                        <SizeUnit
                            label='Min height (minHeight)'
                            defaultSize={84}
                            defaultUnit='px'
                            onChange={(size, unit) => setProps((prev: any) => ({ ...prev, minHeight: size + unit }))}
                        />
                        <SizeUnit
                            label='Max height (maxHeight)'
                            defaultSize={100}
                            defaultUnit='%'
                            onChange={(size, unit) => setProps((prev: any) => ({ ...prev, maxHeight: size + unit }))}
                        />
                        <Switch
                            label='Fit width content (fitWidthContent)'
                            default={defaults.fitWidthContent}
                            onChange={v => {
                                setProps((prev: any) => ({ ...prev, fitWidthContent: v.target.checked, maxWidth: '100%' }))
                            }}
                        />
                        {!p.fitWidthContent && <SizeUnit
                            label='Max width (maxWidth)'
                            defaultSize={100}
                            defaultUnit='%'
                            onChange={(size, unit) => setProps((prev: any) => ({ ...prev, maxWidth: size + unit }))}
                        />}
                    </Configurator>
                </Aside>
                <Modal opened={opened} onClose={close} title='Columns'>
                    <Stack>
                        <Textarea
                            value={columnsString}
                            minRows={16}
                            autosize
                            onChange={v => setClumnsString(v.target.value)}
                        />
                        <Group position='right'>
                            {schemeButtonColor === 'red' ? <Text color='red'>Ошибка проверки кода</Text> : null}
                            <Button
                                variant='outline'
                                color={schemeButtonColor}
                                onClick={() => {
                                    setProps((prev: any) => {
                                        try {
                                            const evalColumns = eval(columnsString)
                                            setSchemeButtonColor('blue')
                                            close()
                                            return { ...prev, table2Columns: evalColumns }
                                        } catch (error) {
                                            setSchemeButtonColor('red')
                                            return prev
                                        }
                                    })
                                }}
                            >Save</Button>
                        </Group>
                    </Stack>
                </Modal>
            </Mantine>
        </App>
    </Suspense>
}
