import { IconKeyboard } from '@tabler/icons-react'
import { useCallback, useEffect, useRef, useState } from 'react'

interface ChangeKeyBindsProps extends React.ComponentProps<'dialog'> {
	keybinds: string[]
	onKeybinChange?: (key: string) => void
	onFinish?: (keybinds: string[]) => void
	onConfirm?: (keybinds: string[]) => void
	onCancel?: () => void
	min?: number
	max?: number
	ref: React.RefObject<HTMLDialogElement | null>
}

export function ChangeKeyBinds({
	ref,
	keybinds: binds,
	max = 3,
	onKeybinChange,
	onFinish,
	onConfirm,
	onCancel,
	className,
	...props
}: ChangeKeyBindsProps) {
	const [isOpen, setIsOpen] = useState(false)
	const [keybinds, setKeybinds] = useState<string[]>(binds || [])
	const modalRef = useRef<HTMLDialogElement>(null)

	const handleCancel = useCallback(() => {
		onCancel?.()
		setKeybinds([])
	}, [onCancel])

	const handleConfirm = useCallback(() => {
		onConfirm?.(keybinds)
	}, [keybinds, onConfirm])

	const handleKeyDown = useCallback(
		(event: KeyboardEvent) => {
			if (!isOpen) return
			event.preventDefault()

			const { code } = event
			const key = code.replace(/right|left|key/i, '')
			if (keybinds.includes(key)) return
			if (keybinds.length >= max) return onFinish?.(keybinds)

			setKeybinds((prev) => prev.concat(key))
			onKeybinChange?.(key)
		},
		[keybinds, max, onKeybinChange, isOpen, onFinish]
	)

	useEffect(() => {
		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [handleKeyDown])

	useEffect(() => {
		if (
			!ref ||
			!('current' in ref) ||
			!ref.current ||
			typeof ref === 'function'
		)
			return

		const observer = new MutationObserver(() => {
			setIsOpen(ref.current?.open ?? false)
		})

		observer.observe(ref.current, {
			attributes: true,
			attributeFilter: ['open']
		})

		return () => observer.disconnect()
	}, [ref])

	return (
		<dialog
			ref={(node) => {
				modalRef.current = node
				if (ref) ref.current = node
			}}
			className="hidden items-center justify-center bg-overlay/60 size-full fixed inset-0 min-h-screen backdrop-blur-xs open:flex group opacity-0 open:starting:opacity-0 open:opacity-100 transition-discrete overflow-hidden"
			{...props}
		>
			<div className="flex-col gap-2 items-center justify-center bg-surface p-6 rounded text-text-primary w-100 hidden translate-y-24 opacity-95 group-open:flex group-open:translate-y-0 group-open:opacity-100 group-open:starting:translate-y-24 group-open:starting:opacity-95 transition-discrete">
				<header className="flex flex-col items-center justify-center gap-2">
					<div className="p-2 rounded bg-primary">
						<IconKeyboard />
					</div>

					<h2 className="text-xl">Shorcuts Recorded</h2>
					<p className="text-sm text-text-muted text-center mx-auto w-10/12">
						{keybinds.length > 0
							? "New keybinding captured. Do you want to assing this combination to 'Open Picker'?"
							: 'Waiting for keyboard input...'}
					</p>
				</header>

				<main className="w-full mt-5">
					<div className="px-3 py-6 bg-surface-soft rounded-lg flex justify-center border border-border w-10/12 mx-auto">
						{keybinds.length === 0 && (
							<span className="text-3xl text-text-muted leading-6 flex flex-row gap-0.5">
								<span className="block animate-float animate-iteration-count-infinite animate-delay-0 animate-fill-mode-both animate-duration-1500">
									.
								</span>
								<span className="block animate-float animate-iteration-count-infinite animate-delay-120 animate-fill-mode-both animate-duration-1500">
									.
								</span>
								<span className="block animate-float animate-iteration-count-infinite animate-delay-240 animate-fill-mode-both animate-duration-1500">
									.
								</span>
							</span>
						)}
						{keybinds.map((k, index) => {
							return (
								<div className="text-text-muted font-bold" key={k}>
									<code>{k}</code>
									{index < keybinds.length - 1 && (
										<span className="mx-2 text-sm">+</span>
									)}
								</div>
							)
						})}
					</div>
				</main>

				<footer className="flex flex-row gap-4 w-full mt-4">
					<button
						className="px-4 py-2 rounded-xl border border-border w-full cursor-pointer hover:bg-surface-soft"
						type="button"
						onClick={handleCancel}
					>
						Cancel
					</button>
					<button
						disabled={keybinds.length === 0}
						className="px-4 py-2 rounded-xl w-full cursor-pointer bg-linear-120 from-primary-pressed to-primary hover:from-primary disabled:cursor-not-allowed"
						type="button"
						onClick={handleConfirm}
					>
						Confirm
					</button>
				</footer>
			</div>
		</dialog>
	)
}
