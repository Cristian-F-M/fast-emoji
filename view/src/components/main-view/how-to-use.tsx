import {
	IconCornerDownLeft,
	IconKeyboard,
	IconPlayerPlayFilled,
	IconSearch,
	IconX
} from '@tabler/icons-react'
import React, { useCallback, useRef } from 'react'
import { Link } from 'react-router'
import { twMerge } from 'tailwind-merge'
import type { Window } from '@/src/types/main-window'

interface Step {
	id: string
	title: string
	description: string
	icon: () => React.ReactNode
	iconStyle?: {
		icon?: string
		container?: string
		stepText?: string
	}
}

const steps: Step[] = [
	{
		id: 'type',
		title: 'Type ":"',
		description:
			'Simply type a colon anywhere to activate the quick-access panel instantly.',
		icon: () => <IconKeyboard />
	},
	{
		id: 'search',
		title: 'Search',
		description:
			'Start typing keywords like "fire" or "smile" to filter to through your library.',
		icon: () => <IconSearch />
	},
	{
		id: 'select',
		title: 'Select',
		description:
			'Use your arrow keys (or mouse) to navigate and press Enter (or click) to insert your choice instantly',
		icon: () => <IconCornerDownLeft />
	},
	{
		id: 'close',
		title: 'Escape',
		description:
			'Changed your mind?\nPress ESC to close the panel and keep typing.',
		icon: () => <IconX />,
		iconStyle: {
			container: 'text-red-400/80 bg-red-900/15 shadow-red-800/5',
			stepText: 'text-red-400/70'
		}
	}
]

export default function HowToUse() {
	const Window = window as unknown as Window
	const demoInputRef = useRef<HTMLInputElement>(null)

	const handleOpenPicker = useCallback(() => {
		Window.pywebview.api.open_picker()
		demoInputRef.current?.focus()
	}, [])

	return (
		<section className="">
			<header className="flex flex-col items-center justify-center gap-2">
				<h1 className="text-4xl uppercase font-semibold bg-linear-to-r from-text-secondary to-primary bg-clip-text text-transparent">
					Master your emojis in seconds.
				</h1>
				<p className="text-center text-pretty w-8/12 text-text-muted text-sm">
					Stop diggin through menus.{' '}
					<span className="text-primary font-semibold">Fast emoji</span> lets
					you express yourself at the speed of thought with simple keyboard
					triggers.
				</p>
			</header>
			<main className="mt-10">
				<div className="grid grid-cols-4 gap-4 ">
					{steps.map((step, i) => {
						const icon = step.icon() as React.ReactElement

						const Icon = (p: React.SVGProps<SVGAElement>) =>
							React.cloneElement(icon, p)

						const stepN = i + 1
						return (
							<div
								className="bg-surface-soft rounded-2xl p-5 flex flex-col items-center justify-center"
								key={step.id}
							>
								<header className="space-y-1 flex flex-col justify-center items-center">
									<div
										className={twMerge(
											'p-3 bg-primary/20 shadow-[0px_0px_15px_15px] shadow-primary/10 rounded-xl size-fit',
											step.iconStyle?.container
										)}
									>
										<Icon className="size-6" />
									</div>
									<span
										className={twMerge(
											'text-sm text-text-muted',
											step.iconStyle?.stepText
										)}
									>
										Step {String(stepN).padStart(2, '0')}
									</span>
									<h4 className="font-semibold text-lg">{step.title}</h4>
								</header>
								<main>
									<p className="text-center text-sm text-text-muted w-10/12 text-pretty mx-auto mt-1">
										{step.description}
									</p>
								</main>
							</div>
						)
					})}
				</div>

				<div className="mt-24 p-10 rounded-2xl bg-surface-soft">
					<span className="flex flex-row items-center gap-2 uppercase text-sm text-text-muted bg-surface w-fit px-4 py-1.5 rounded-full">
						<span className="block size-2 bg-primary rounded-full"></span>
						Live demo
					</span>

					<section className="flex flex-row gap-5 mt-6">
						<section>
							<header>
								<h3 className="text-3xl">Interactive preview</h3>
							</header>

							<p className="text-text-muted mt-4 w-10/12 text-balance">
								The panel floats seamlessly over any application you are using.
								It's lightweight, non-intrusive, and blazird fast.
							</p>

							<div className="w-10/12 mt-4 overflow-hidden h-0 has-[input:focus]:h-auto [interpolate-size:allow-keywords]">
								<input
									ref={demoInputRef}
									className="w-full h-10 outline-none border border-border bg-surface rounded-3xl px-3"
									type="text"
									placeholder="Type 'fire'"
								/>
							</div>

							<div className="mt-4 flex flex-row gap-4">
								<button
									className="bg-linear-120 from-primary to-primary-pressed px-5 py-1.5 rounded-xl flex flex-row gap-2 items-center cursor-pointer hover:scale-105"
									type="button"
									onClick={handleOpenPicker}
								>
									<span className="block p-1 bg-surface rounded-full">
										<IconPlayerPlayFilled className="text-text-primary size-2" />
									</span>{' '}
									Try it now
								</button>
								<Link
									to="/settings"
									className="border border-border bg-surface/60 px-5 py-1.5 rounded-xl cursor-pointer hover:bg-surface-soft"
								>
									View keyboard shortcuts
								</Link>
							</div>
						</section>
						<section className="h-full relative">
							<div className="w-90 relative rounded-3xl overflow-hidden">
								<img className="size-full" src="/my-settings.avif" alt="No " />
								<div className="absolute bg-background/60 size-full inset-0"></div>
							</div>

							<div className="absolute bg-surface-soft border border-border w-50 h-60 top-1/2 left-1/2 -translate-1/2 rounded-xl p-4 shadow-[0_0_10px_10px] shadow-black/15">
								<header className="flex flex-row gap-3 items-center">
									<span className="bg-primary px-2 py-0.5 rounded ">star</span>
									<span className="block w-full h-2 bg-background/40 rounded-3xl"></span>
								</header>

								<main className="grid grid-cols-[repeat(auto-fill,minmax(28px,1fr))] gap-2.5 content-start text-sm mt-6">
									{['🤩', '💖', '💫'].map((e) => {
										return (
											<div
												key={e}
												className="emoji-item text-center p-1 rounded bg-surface size-7 hover:bg-surface-soft cursor-pointer outline-none ring-primary hover:ring-2 overflow-hidden"
											>
												{e}
											</div>
										)
									})}
								</main>
							</div>
						</section>
					</section>
				</div>
			</main>
			<hr className="mt-20 mb-10 text-text-muted/40" />

			<span className="text-center block mx-auto w-fit text-sm text-text-muted">
				Need more help? Read the{' '}
				<a
					className="text-primary hover:underline"
					href="https://github.com/Cristian-F-M/fast-emoji/#readme"
					target="_blank"
					rel="noopener noreferrer"
				>
					Full Documentation
				</a>
			</span>
		</section>
	)
}
