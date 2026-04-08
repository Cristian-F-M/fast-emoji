import { create } from 'zustand'
import type { Configs } from '@/types/config'

interface ConfigState {
	configs: Configs
	setConfigs: (config: Configs) => void
	changeConfigs: (config: {
		key: keyof Configs
		value: Configs[keyof Configs]
	}) => void
}

const useConfig = create<ConfigState>()((set, get) => ({
	configs: {
		theme: 'dark'
	},
	setConfigs: (configs) => set({ configs }),
	changeConfigs: ({ key, value }) => {
		const configs = get().configs
		configs[key] = value
		return set({ configs })
	}
}))

export default useConfig
