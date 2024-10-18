export default {
	start() {
		document.body.insertAdjacentHTML(
			'afterbegin',
			`<div id="loadingAnimation" class="loader">	
        <div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
        <div id="loadingProgress" class="progress"><div class="progress-section" style="width: ${0}%;"></div>
      </div>`
		)
	},
	progress(progress: number) {
		const progressEl = document.getElementById('loadingProgress')
		if (progressEl)
			progressEl.innerHTML = `<div id="loadingProgress" class="progress"><div class="progress-section" style="width: ${progress}%;"></div>`
	},
	stop() {
		const loaderEl = document.getElementById('loadingAnimation')
		loaderEl?.parentNode?.removeChild(loaderEl)
	},
}
