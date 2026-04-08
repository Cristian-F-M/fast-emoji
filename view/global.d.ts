import type { Configs } from '@/types/config'

declare global {
	interface Window {
		pywebview: {
			api: {
				log: (...args: unknown[]) => Promise<void>
				hide_window: () => Promise<void>
				print_emoji(emoji: string): Promise<void>
				handle_input(value: string): Promise<void>
				set_focused_emoji(emoji: string): Promise<void>
				get_configs: () => Promise<Configs>
			}
			state: {}
		}
		setQuery: (query: string, concat?: boolean) => void
		changeFocusedEmoji: (index: number) => void
		move_focused_emoji: (direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => void
		change_focused_emoji: (index: number) => void
		on_hide: () => void
	}
}
