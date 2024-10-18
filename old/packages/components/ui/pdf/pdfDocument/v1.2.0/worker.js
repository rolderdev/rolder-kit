import { expose } from 'comlink'
let log = console.info

const renderPDFInWorker = async (props, React) => {
	self.React = React
	console.log(React)
	try {
		const { renderPDF } = await import('./src/renderPdf.ts')
		return URL.createObjectURL(await renderPDF(props))
	} catch (error) {
		log(error)
		throw error
	}
}

const onProgress = (cb) => (log = cb)

expose({ renderPDFInWorker, onProgress })
