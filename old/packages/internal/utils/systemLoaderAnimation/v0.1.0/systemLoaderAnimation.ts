export default {
	start() {
		document.body.insertAdjacentHTML(
			'afterbegin',
			`<div id="loadingAnimation" style="z-index: 1000; position: fixed; top: 50%; left: 50%; -webkit-transform: translate(-50%, -50%); transform: translate(-50%, -50%);">	
				<div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
			</div>`
		)
	},
	stop() {
		const loaderEl = document.getElementById('loadingAnimation')
		loaderEl?.parentNode?.removeChild(loaderEl)
	},
}
