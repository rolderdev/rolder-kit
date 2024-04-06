import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import styled from '@emotion/styled'
import type { Props } from './types';
import { getCompProps } from "@packages/get-comp-props"
import { sendOutput } from '@packages/port-send';
import isEmpty from '@packages/is-empty';
import React from 'react';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.js',
    import.meta.url,
).toString();

export default forwardRef(function (props: Props, ref) {
    const p = { ...getCompProps(props) } as Props

    const { noodlNode, sourceUrl } = p

    const [totalPages, setNumPages] = useState(null)
    useEffect(() => { if (totalPages !== null) sendOutput(noodlNode, 'totalPages', totalPages) }, [totalPages])

    const [currentPage, setCurrentPage] = useState(1)
    useEffect(() => sendOutput(noodlNode, 'currentPage', currentPage), [currentPage])
    useEffect(() => { if (!isEmpty(p.currentPage)) setCurrentPage(p.currentPage || 1) }, [p.currentPage])

    const onDocumentLoad = (d: any) => setNumPages(d.numPages)

    useImperativeHandle(ref, () => ({
        nextPage() { setCurrentPage((prev) => prev === totalPages ? prev : prev + 1) },
        previousPage() { setCurrentPage((prev) => prev === 1 ? prev : prev - 1) },
    }), [totalPages])

    const DocumentWrapper = styled.div`
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        }`

    return <DocumentWrapper>
        <Document
            key={sourceUrl}
            file={sourceUrl}
            loading='Загружается документ'
            noData='Документ не найден'
            onLoadSuccess={onDocumentLoad}
        >
            <Page
                key={currentPage}
                pageNumber={currentPage}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                width={p.pdfViewerWidth}
                height={p.pdfViewerHeight}
                loading='Загружается страница'
                noData='Нет такой страницы'
            />
        </Document>
    </DocumentWrapper>
})