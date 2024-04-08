import { Suspense, lazy, useState } from 'react'
import Aside from '../../containers/Aside'
import Data from '../../containers/Data'
import App from '../../containers/App'
import Configurator from '../../configurator/Configurator'
import Switch from '../../configurator/Switch'
import useOutputs from '../../hooks/useOutputs'
import { useDisclosure, useForceUpdate } from '@mantine/hooks'
import { Prism } from '@mantine/prism'
import { Button, Center, Group, Modal, ScrollArea, Stack, Text, Textarea } from '@mantine/core'
import React from 'react'
import TextInput from '../../configurator/TextInput'

const UseData = lazy(() => import('@packages/use-data'))
const defaults = {
    fetchScheme: [
        {
            dbClass: 'group',
            size: 1000,
            filters: { not: { exists: 'group.id' } },
            sorts: [{ 'content.name': 'asc' }],
            hierarchyFunc: `(level, parentItem) => {
                if (level === 5) return
                return [
                    {
                        dbClass: 'group',
                        filters: { equals: { 'group.id': parentItem.id } },
                        sorts: [{ 'content.name': 'asc' }]                                               
                    }
                ]
            }`
            //history: 10
            /* sorts: {
                "_script": {
                    "type": "string",
                    "order": "asc",
                    "script": {
                      "lang": "painless",
                      "source": "doc['content.name.keyword'].value"
                    }
                  }
            } */

            /* filters: { not: { exists: 'group.id' } },
            sorts: [{ 'content.name': 'asc' }],
            searchFields: ['content.name.search'],
            
            hierarchyFunc: `(parentItem, level) => {                
                if (level === 5) return
                return [
                    {
                        dbClass: 'group',
                        filters: { equals: { 'group.id': parentItem.id } },
                        sorts: [{ 'content.name': 'asc' }]                        
                    }
                ]
            }` */
        }
    ],
    searchEnabled: false,
    paginationDbClass: 'car'
}

export default function (props: any) {
    const [mounted, setMounted] = useState(false)
    const forcUpdate = useForceUpdate()

    const { noodlNode, outputValues } = useOutputs(forcUpdate)

    const [p, setProps] = useState({ noodlNode, ...defaults, ...props })
    const [opened, { open, close }] = useDisclosure(false)

    const [schemeString, setSchemeString] = useState(JSON.stringify(p.fetchScheme, null, 1))
    const [schemeButtonColor, setSchemeButtonColor] = useState('blue')

    const localRef = React.useRef<any>(null)

    return <Aside>
        <App>
            <Center w='100%' p={16}>
                <Data backendDevMode={false}>
                    <Suspense fallback={<div style={{ padding: 8 }}>Mounting...</div>}>
                        {mounted
                            ? <>
                                <UseData {...p} ref={localRef} />
                                <Stack>
                                    <Text>Outputs:</Text>
                                    {//@ts-ignore  
                                        <ScrollArea h={600}>
                                            <Prism language="javascript" >{JSON.stringify(outputValues, null, 1)}</Prism>
                                        </ScrollArea>
                                    }
                                </Stack>
                            </>
                            : <div style={{ padding: 8 }}>UseData not mounted</div>}
                    </Suspense>
                </Data>
                <Modal opened={opened} onClose={close} title='Scheme'>
                    <Stack>
                        <Textarea
                            value={schemeString}
                            minRows={16}
                            autosize
                            onChange={v => setSchemeString(v.target.value)}
                        />
                        <Group position='right'>
                            {schemeButtonColor === 'red' ? <Text color='red'>Ошибка проверки кода</Text> : null}
                            <Button
                                variant='outline'
                                color={schemeButtonColor}
                                onClick={() => {
                                    setProps((prev: any) => {
                                        try {
                                            const evalScheme = eval(schemeString)
                                            setSchemeButtonColor('blue')
                                            close()
                                            return { ...prev, fetchScheme: evalScheme }
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
            </Center>
            <Configurator w={600}>
                <Button variant='outline' onClick={open}>Scheme</Button>
                <Switch
                    withRestore={false}
                    label='Mounted'
                    default={false}
                    onChange={v => setMounted(v.target.checked)}
                />
                {mounted
                    ? <Switch
                        label='Search (searchEnabled)'
                        default={false}
                        onChange={v => setProps((prev: any) => ({ ...prev, searchEnabled: v.target.checked }))}
                    />
                    : null}
                {p.searchEnabled
                    ? <TextInput
                        placeholder='Поиск'
                        onChange={v => setProps((prev: any) => ({ ...prev, searchString: v.target.value }))}
                    />
                    : null}
                {mounted
                    ? <Switch
                        label='Pagination (paginationEnabled)'
                        default={false}
                        onChange={v => setProps((prev: any) => ({ ...prev, paginationEnabled: v.target.checked }))}
                    />
                    : null}
                {p.paginationEnabled
                    ? <Group grow>
                        <Button variant='outline' onClick={() => localRef.current.previousFetch()}>
                            Previus
                        </Button>
                        <Button variant='outline' onClick={() => localRef.current.nextFetch()}>
                            Next
                        </Button>
                    </Group>
                    : null}
                {mounted
                    ? <Button variant='outline' onClick={() => localRef.current.refetch()}>
                        Refetch
                    </Button>
                    : null}
            </Configurator>
        </App>
    </Aside >
}