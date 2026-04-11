interface SwitchProps extends React.HTMLAttributes<HTMLInputElement> {
	id: string
	name: string
	value: boolean
	onValueChange: (value: boolean) => void
	labelProps?: React.HTMLAttributes<HTMLLabelElement>
}

export function Switch({
	className,
	id,
	name,
	value,
	onValueChange,
	...props
}: SwitchProps) {
	return (
		<label htmlFor={id} className="cursor-pointer flex items-center">
			<div className="relative w-12 h-6">
				<input
					id={id}
					name={name}
					type="checkbox"
					defaultChecked={value}
					onChange={(e) => onValueChange(e.target.checked)}
					className="sr-only peer"
					{...props}
				/>

				<div className="w-full h-full bg-surface rounded-full peer-checked:bg-primary/20 transition-colors" />
				<div className="absolute top-1/2 left-1 -translate-y-1/2 w-4 h-4 rounded-full bg-primary/30 peer-checked:translate-x-6 peer-checked:bg-primary transition-all duration-200 ease-in-out" />
			</div>
		</label>
	)
}
