export default function addCssToHtmlHead(nodePackageNames: string[]) {
	for (const nodePackageName of nodePackageNames) {
		const cssLink = document.createElement('link');
		cssLink.type = 'text/css';
		cssLink.rel = 'stylesheet';
		cssLink.href = `noodl_modules/${nodePackageName}/${nodePackageName}.css`;
		document.head.appendChild(cssLink);
	}
}
