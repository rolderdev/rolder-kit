import { useState } from 'react'
import Aside from '../../containers/Aside'
import Data from '../../containers/Data'
import App from '../../containers/App'
import Configurator from '../../configurator/Configurator'
import useOutputs from '../../hooks/useOutputs'
import { useDisclosure, useForceUpdate } from '@mantine/hooks'
import { Prism } from '@mantine/prism'
import { Button, Center, Group, Modal, ScrollArea, Stack, Text, Textarea } from '@mantine/core'
import React = require('react')
import isEmpty from '@shared/is-empty'

const update = import('@shared/update')
const defaults = {
    scheme: [
        {
            dbClass: 'car',
            history: false,
            items: [{
                id: '-AFCkI4Bp3cjDcIfbn3H',
                content: {
                    "name": "ford galaxie 500",
                    "milesPerGallon": 15,
                    "cylinders": 8,
                    "displacement": 351,
                    "horsepower": 153,
                    "weightInLbs": 4129,
                    "acceleration": 13,
                    "year": "1972",
                    "origin": "USA"
                }
            }]
        }
    ],
    optimistic: false
}

export default function (props: any) {
    const forcUpdate = useForceUpdate()

    const { noodlNode, outputValues } = useOutputs(forcUpdate)

    const [p, setProps] = useState({ noodlNode, ...defaults, ...props })
    const [opened, { open, close }] = useDisclosure(false)

    const [schemeString, setSchemeString] = useState(JSON.stringify(p.scheme, null, 1))
    const [schemeButtonColor, setSchemeButtonColor] = useState('blue')

    return <Aside>
        <App>
            <Center w='100%' p={16}>
                <Data backendDevMode={false}>
                    {!isEmpty(outputValues)
                        ? <Stack>
                            <Text>Outputs:</Text>
                            {//@ts-ignore 
                                <ScrollArea h={600}>
                                    <Prism language="javascript" >{JSON.stringify(outputValues, null, 1)}</Prism>
                                </ScrollArea>
                            }
                        </Stack>
                        : null}
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
                                    setProps(prev => {
                                        try {
                                            const evalScheme = eval(schemeString)
                                            setSchemeButtonColor('blue')
                                            close()
                                            return { ...prev, scheme: evalScheme }
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
                <Button variant='outline' onClick={() => { update.then(module => module.default.update(p)) }}>Update</Button>
            </Configurator>
        </App>
    </Aside >
}