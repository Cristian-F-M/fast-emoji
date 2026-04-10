import { twMerge } from 'tailwind-merge'

interface SettingRow extends React.HTMLAttributes<HTMLElement> {
	title: string
	description?: string
	childrenClassName?: string
}

export function SettingRow({
	title,
	description,
	className,
	children,
	childrenClassName,
	...props
}: SettingRow) {
	return (
		<section
			className={twMerge(
				'border-b border-border last:border-transparent py-5',
				className
			)}
			{...props}
		>
			<header>
				<h3 className="text-lg">{title}</h3>
				{description && (
					<p className="text-sm text-text-muted">{description}</p>
				)}
			</header>

			<main className={twMerge('mt-4', childrenClassName)}>{children}</main>
		</section>
	)
}
