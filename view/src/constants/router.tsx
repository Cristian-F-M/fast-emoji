import {
	IconAlertCircle,
	IconHelpCircle,
	IconHome,
	IconSettings
} from '@tabler/icons-react'
import type { Link } from '@/types/router'

export const LINKS = [
	{
		id: 'home',
		to: '/',
		content: () => (
			<>
				<IconHome />
				Home
			</>
		)
	},

	{
		id: 'settings',
		to: 'settings',
		content: () => (
			<>
				<IconSettings />
				Settings
			</>
		)
	},
	{
		id: 'how-to-use',
		to: 'How-to-use',
		content: () => (
			<>
				<IconHelpCircle />
				How to use
			</>
		)
	},
	{
		id: 'about',
		to: 'about',
		content: () => (
			<>
				<IconAlertCircle />
				about
			</>
		)
	}
] satisfies Link[]
