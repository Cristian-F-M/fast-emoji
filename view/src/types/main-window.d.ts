import type { Configs } from '@/types/config'

export interface Window extends globalThis.Window {
	pywebview: {
		api: {
			log: (...args: unknown[]) => Promise<void>
			hide_window: () => Promise<void>
			get_configs: () => Promise<Configs>
			change_config: (section: string, option: string, value: unknown) => void
			open_picker: () => Promise<void>
		}
		state: {}
	}
	on_hide: () => void
}
