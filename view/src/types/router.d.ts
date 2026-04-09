export interface Link {
	id: string
	to: string
	content: () => React.ReactNode
}
