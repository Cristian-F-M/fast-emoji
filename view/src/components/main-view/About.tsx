import { IconBug, IconCode } from '@tabler/icons-react'
import Logo from '@/icons/logo'
import pkg from '@/package.json'

export default function About() {
	return (
		<section className="flex flex-col justify-center items-center ">
			<header>
				<Logo className="size-46" />

				<h1 className="text-5xl">Fast Emoji</h1>
				<span className="block w-fit mx-auto px-5 py-0.5 bg-primary/10 rounded-full mt-2 text-xs text-text-secondary uppercase">
					v{pkg.version}
				</span>
			</header>

			<main className="mt-10">
				<div className="bg-surface-soft p-6 rounded-xl w-105 text-center text-text-muted">
					<p>
						"A fast emoji for desktop inspired by modern productivity tools."
					</p>

					<footer className="mt-6">
						<span className="uppercase text-text-muted text-[10px] font-mono leading-0">
							created by
						</span>
						<h2 className="text-text-primary leading-tight font-mono">
							Cristian Morales
						</h2>
					</footer>
				</div>

				<div className="mt-10 flex flex-row items-center gap-4">
					<a
						className="w-full bg-linear-120 from-primary-pressed to-primary rounded px-4 py-1.5 text-center hover:scale-105 flex flex-row items-center gap-1 justify-center [&_svg]:size-5"
						target="_blank"
						rel="noopener noreferrer"
						href="https://github.com/Cristian-F-M/"
					>
						<IconCode />
						GitHub
					</a>
					<a
						className="w-full rounded px-4 py-1.5 text-center bg-surface-soft border border-border hover:bg-surface hover:border-border/50 flex flex-row items-center gap-1 justify-center [&_svg]:size-5"
						target="_blank"
						rel="noopener noreferrer"
						href="https://github.com/Cristian-F-M/fast-emoji/issues/new"
					>
						<IconBug />
						Report issue
					</a>
				</div>
			</main>
		</section>
	)
}
