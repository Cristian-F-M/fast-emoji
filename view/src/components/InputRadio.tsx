import { twMerge } from 'tailwind-merge'

interface InputRadioProps {
	id: string
	name: string
	value: string
	currentValue: string
	onValueChange: (value: string) => void
}

export function InputRadio({
	id,
	name,
	value,
	onValueChange,
	currentValue
}: InputRadioProps) {
	const isChecked = value === currentValue

	return (
		<label htmlFor={id} className="relative cursor-pointer">
			<input
				className="sr-only peer"
				type="radio"
				value={value}
				name={name}
				id={id}
				onChange={(e) => {
					onValueChange(e.target.value)
				}}
			/>
			<div className="size-4 rounded-full bg-primary/20 border border-border relative">
				<div
					className={twMerge(
						'absolute top-1/2 left-1/2 -translate-1/2 size-8/12 bg-transparent rounded-full',
						isChecked && 'bg-primary'
					)}
				></div>
			</div>
		</label>
	)
}
