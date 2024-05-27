import { forwardRef, useEffect, useRef } from "react";
import type { Props } from "./types";;
import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor/dist/i18n/ru-ru';
import { Viewer } from '@toast-ui/react-editor';
import 'prismjs/themes/prism.css';
import '@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css';
import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight';
import uml from '@toast-ui/editor-plugin-uml';
//@ts-ignore
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript.js';
import 'prismjs/components/prism-typescript.js';
import 'prismjs/components/prism-python.js';
//
export default forwardRef(function (props: Props) {
    const viewerRef = useRef<any>();

    useEffect(() => {
        if (props.markdown) {
            const instance = viewerRef.current?.getInstance()
            instance.setMarkdown(props.markdown)
        }
    }, [props.markdown])

    return <Viewer
        ref={viewerRef}
        usageStatistics={false}
        plugins={[[codeSyntaxHighlight, { highlighter: Prism }], uml]}
        {...props}
        {...props.customProps}
    />
})
