import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { CompProps } from './types';
import { sendOutput } from '../../../../../../../libs/nodesFabric/v0.1.0/send/v0.4.0/send';
import getCompProps from "../../../../../../../libs/nodesFabric/v0.1.0/getCompProps/v0.1.0/getCompProps"
import styled from '@emotion/styled'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.js',
    import.meta.url,
).toString();

export default forwardRef(function (props: CompProps, ref) {
    const { isNil } = window.R.libs.lodash

    const p = { ...getCompProps(props) } as CompProps

    const { noodlNode, sourceUrl } = p

    const [totalPages, setNumPages] = useState(null)
    useEffect(() => { if (totalPages !== null) sendOutput(noodlNode, 'totalPages', totalPages) }, [totalPages])

    const [currentPage, setCurrentPage] = useState(1)
    useEffect(() => sendOutput(noodlNode, 'currentPage', currentPage), [currentPage])
    useEffect(() => { if (!isNil(p.currentPage)) setCurrentPage(p.currentPage) }, [p.currentPage])

    const onDocumentLoad = (d: any) => {
        setNumPages(d.numPages)
        setCurrentPage((prev) => Math.min(prev, d.numPages))
    }

    useImperativeHandle(ref, () => ({
        nextPage() { setCurrentPage((prev) => prev + 1) },
        previousPage() { setCurrentPage((prev) => prev - 1) },
    }), [])

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