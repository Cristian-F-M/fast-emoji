import { create } from 'zustand'
import type { Configs } from '@/types/config'

interface ConfigState {
	configs: Configs
	setConfigs: (config: Configs) => void
	changeConfigs: (config: {
		key: keyof Configs
		value: Configs[keyof Configs]
	}) => void
	load: () => void
}

const useConfig = create<ConfigState>()((set, get) => ({
	configs: {
		theme: 'dark',
		launchAtStartup: true,
		runInBackground: true
	},
	setConfigs: (configs) => set({ configs }),
	changeConfigs: ({ key, value }) => {
		const configs = get().configs

		if (!(key in configs)) return

		if (typeof value !== typeof configs[key]) return

		;(configs[key] as unknown) = value

		if (key === 'theme')
			document.documentElement.setAttribute('data-theme', String(value))

		return set({ configs })
	},
	load: async () => {
		const configs = await window.pywebview.api.get_configs()
		set({ configs })
	}
}))

export default useConfig
