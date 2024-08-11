import type { Props } from "./types";
import { useState, useRef, forwardRef } from 'react'
import { Controlled } from 'react-codemirror2'
import { sendOutput } from "@packages/port-send";

export default forwardRef(function (props: Props) {
    const codeMirrorRef = useRef<any>();

    // дефолтной темой является dracula
    const [theme, setTheme] = useState('dracula')

    // const handleMarkdown = (editor, data, value) => {
    //     sendOutput(props.noodlNode, 'markdown', value)
    // }

    // useEffect(() => {
    //     codeMirrorRef.current.editor.setOption('theme', theme);
    // }, [theme])

    return (
        <Controlled
            value={value}
            options={{
                mode: 'markdown',
                theme: theme,
                lineNumbers: true
            }}
        />
    )
})

// onBeforeChange={(editor, data, value) => {
//     // handle change
// }}
// onChange={handleMarkdown}