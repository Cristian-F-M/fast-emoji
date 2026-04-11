import React from 'react'
import { twMerge } from 'tailwind-merge'
import { Switch } from '@/components/Switch'

interface SwitchRow extends React.HTMLAttributes<HTMLDivElement> {
	title: string
	description: string
	icon: () => React.ReactNode
	id: string
	name: string
	value: boolean
	onValueChange: (value: boolean) => void
}

export function SwitchRow({
	title,
	description,
	icon,
	onValueChange,
	className,
	id,
	name,
	value,
	...props
}: SwitchRow) {
	const i = icon() as React.ReactElement
	if (!React.isValidElement(i))
		throw new Error('Icon must be a valid svg element')

	const Icon = (p: React.SVGProps<SVGAElement>) => React.cloneElement(i, p)

	return (
		<div
			className={twMerge(
				'flex flex-row items-center justify-between px-6 py-4 rounded-xl bg-surface-soft',
				className
			)}
			{...props}
		>
			<div className="flex flex-row gap-4 items-center w-full">
				<div className="bg-primary/30 p-2 rounded">
					<Icon />
				</div>

				<div className="w-full">
					<h4>{title}</h4>
					<p
						title={description}
						className="text-sm text-text-muted max-w-8/12 line-clamp-1"
					>
						{description}
					</p>
				</div>
			</div>

			<div>
				<Switch
					value={value}
					onValueChange={onValueChange}
					id={id}
					name={name}
				/>
			</div>
		</div>
	)
}
