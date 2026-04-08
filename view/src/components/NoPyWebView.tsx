export default function NoPyWebView() {
	return (
		<section className="bg-background p-4 h-screen pb-20 backdrop-blur-2xl flex flex-col items-center justify-center">
			<h1 className="text-center text-text-secondary text-lg">
				We are loading webview view
			</h1>
			<div className="flex justify-center mt-8">
				<div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
			</div>
		</section>
	)
}
