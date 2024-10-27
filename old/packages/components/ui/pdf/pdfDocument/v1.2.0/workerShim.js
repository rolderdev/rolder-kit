if (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope) {
	self.global = self
	self.window = self
	console.log(self.React)
}
