import { NavLink, Outlet } from 'react-router'
import { twMerge } from 'tailwind-merge'
import { LINKS } from '@/constants/router'
import pkg from '@/package.json' with { type: 'json' }

export default function SideMenu() {
	return (
		<div className="flex flex-row size-full">
			<section className="h-full bg-surface p-5 w-70">
				<header className="w-full">
					<h3 className="text-xl font-semibold leading-[0.8]">Fast Emoji</h3>
					<span className="text-xs text-text-muted leading-0">
						v{pkg.version}
					</span>
				</header>

				<main className="mt-4">
					<nav className="flex flex-col gap-2">
						{LINKS.map((l) => {
							const content = l.content()

							return (
								<NavLink
									key={`link-${l.id}`}
									to={l.to}
									className={({ isActive }) =>
										twMerge(
											'flex flex-row gap-2 items-center [&_svg]:size-4.5 px-3 py-2 rounded-xl [.active]:bg-surface-soft transition-all duration-200 text-text-muted hover:bg-primary/20 ',
											isActive && 'bg-primary button-glow text-text-primary'
										)
									}
								>
									{content}
								</NavLink>
							)
						})}
					</nav>
				</main>
			</section>
			<main className="size-full px-10 overflow-y-auto custom-scroll pt-10 pb-10">
				<Outlet />
			</main>
		</div>
	)
}
