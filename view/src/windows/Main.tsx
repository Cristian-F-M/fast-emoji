import {
	IconBrandSpeedtest,
	IconCode,
	IconKeyboard,
	IconSearch
} from '@tabler/icons-react'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { Link, type LinkProps } from 'react-router'
import { twMerge } from 'tailwind-merge'
import Logo from '@/icons/logo'
import useConfig from '../states/config'

interface GetStartedLinks {
	id: string
	to: string
	content: () => React.ReactNode
	linkProps?: Omit<LinkProps, 'to'>
}

const getStartedLinks: GetStartedLinks[] = [
	{
		id: 'how-to-use',
		to: 'how-to-use',
		content: () => 'Get Started',
		linkProps: {
			className:
				'bg-linear-120 from-primary to-primary-pressed hover:scale-105 hover:from-primary-pressed duration-300'
		}
	},
	{
		id: 'view-on-github',
		to: 'https://github.com/Cristian-F-M/fast-emoji',
		content: () => (
			<>
				<IconCode />
				View on GitHub
			</>
		),
		linkProps: {
			target: '_blank',
			className:
				'bg-surface border border-border/40 hover:bg-surface-soft hover:border-border/20'
		}
	}
]

interface Card {
	id: string
	icon: () => React.ReactNode
	title: string
	description: string
}

const cards: Card[] = [
	{
		id: 'global-hotkeys',
		title: 'Global Hotkeys',
		description:
			'Summon the picker from any application with a customizable shortcut that feels like native UI.',
		icon: () => <IconKeyboard />
	},
	{
		id: 'fuzzy-search',
		title: 'Fuzzy Search',
		description:
			'Instant results even with typos. Type like "fire" or "lit" and find exactly what you need in milliseconds.',
		icon: () => <IconSearch />
	},
	{
		id: 'light-weight',
		title: 'Lightweight',
		description:
			'Build with python for ultimate performance. Usess less that 60MB of RAM while idiling in the background',
		icon: () => <IconBrandSpeedtest />
	}
]

export function Main() {
	const [isPywebviewReady, setIsPywebviewReady] = useState(false)
	const { load } = useConfig()

	useLayoutEffect(() => {
		if (!isPywebviewReady) return
		load()
	}, [load, isPywebviewReady])

	useEffect(() => {
		function onPywebviewReady() {
			setIsPywebviewReady(true)
			window.pywebview.api.log('pywebview ready')
		}

		window.addEventListener('pywebviewready', onPywebviewReady)
		return () => window.removeEventListener('pywebviewready', onPywebviewReady)
	}, [])

	return (
		<section className="flex flex-col items-center justify-center">
			<header className="flex flex-col items-center justify-center gap-2">
				<Logo className="size-46" />
				<h1 className="text-6xl uppercase font-semibold">Fast emoji</h1>
				<p className="text-center text-pretty w-8/12 text-sm text-text-muted">
					The lightning-fast emoji picker for your desktop workflow. Optimized
					for speed, designed for precision, and built into your os.
				</p>
				<div className="mt-6 flex flex-row gap-4 items-center ">
					{getStartedLinks.map((l) => {
						const { className, ...linkProps } = l.linkProps ?? {}
						return (
							<Link
								key={l.id}
								to={l.to}
								className={twMerge(
									'flex flex-row items-center gap-1 px-6 py-2 rounded-2xl [&_svg]:size-4.5',
									className
								)}
								{...linkProps}
							>
								{l.content()}
							</Link>
						)
					})}
				</div>
			</header>

			<main className="flex flex-row items-center gap-6 mt-16">
				{cards.map((c) => {
					const icon = c.icon() as React.ReactElement

					const Icon = (p: React.SVGProps<SVGAElement>) =>
						React.cloneElement(icon, p)

					return (
						<div className="p-5 rounded-xl bg-surface-soft" key={c.id}>
							<header className="flex flex-col gap-4">
								{<Icon className="size-7 text-primary" />}
								<h4 className="text-lg font-semibold">{c.title}</h4>
							</header>

							<main className="mt-1">
								<p className="text-sm text-text-muted">{c.description}</p>
							</main>
						</div>
					)
				})}
			</main>
		</section>
	)
}
