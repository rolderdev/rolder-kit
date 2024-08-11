import { forwardRef, useRef } from "react";
import type { Props } from "./types";;
import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor/dist/i18n/ru-ru';
import { Editor } from '@toast-ui/react-editor';
import 'prismjs/themes/prism.css';
import '@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css';
import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight';
import uml from '@toast-ui/editor-plugin-uml';
//@ts-ignore
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript.js';
import 'prismjs/components/prism-typescript.js';
import 'prismjs/components/prism-python.js';
import { sendOutput } from "@packages/port-send";

export default forwardRef(function (props: Props) {
    const editorRef = useRef<any>();

    const handleMarkdown = () => {
        const instance = editorRef.current?.getInstance()
        const markdown = instance.getMarkdown()
        sendOutput(props.noodlNode, 'markdown', markdown)
    }

    //@ts-ignore
    return (
        <Editor ref={editorRef}
            initialValue={props.markdown}
            language='ru'
            useCommandShortcut={true}
            usageStatistics={false}
            onChange={handleMarkdown}
            plugins={[[codeSyntaxHighlight, { highlighter: Prism }], uml]}
            {...props}
            {...props.customProps}
        />
    )
})
