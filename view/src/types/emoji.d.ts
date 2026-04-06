export interface Emoji {
	en: string
	status: number
	E: number
	alias?: string[]
	variant?: boolean
}

export type GetEmojisReturnType = [string, Emoji][]
