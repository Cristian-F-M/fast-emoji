import {
	IconEyeOff,
	IconKeyboard,
	IconPalette,
	IconRocket
} from '@tabler/icons-react'
import { useCallback } from 'react'
import { twMerge } from 'tailwind-merge'
import { SettingRow } from '@/components/settings/SettingRow'
import { SwitchRow } from '@/components/settings/SwitchRow'
import useConfig from '@/src/states/config'
import type { Window } from '@/src/types/main-window'
import { InputRadio } from '../InputRadio'

export default function Settings() {
	const { configs, changeConfigs } = useConfig()
	const Window = window as unknown as Window

	const generalCardClassName =
		'p-4 bg-surface-soft rounded-2xl w-full max-w-100 has-[&_button:hover]:bg-primary/20  [&_header]:flex [&_header]:flex-row [&_header]:items-center [&_header]:gap-2 [&_header]:[&_svg]:size-4.5 [&_header]:[&_svg]:text-primary [&_main]:mt-4 [&_main_button]:w-full [&_main_button]:bg-surface [&_main_button]:px-4 [&_main_button]:py-2 [&_main_button]:text-xl [&_main_button]:font-semibold [&_main_button]:text-text-muted [&_main_button]:rounded-lg [&_main_button]:cursor-pointer [&_main_button]:hover:bg-primary/10 [&_footer]:mt-4 [&_footer]:text-center [&_footer]:text-sm [&_footer]:text-xs [&_footer]:uppercase [&_footer]:text-text-muted'

	const handleChangeConfig = useCallback(
		(section: string, option: string, value: unknown) => {
			Window.pywebview.api.change_config(section, option, value)
		},
		[]
	)

	const handleChangeTheme = useCallback(
		(t: string) => {
			handleChangeConfig('app', 'theme', t)
			changeConfigs({
				key: 'theme',
				value: t as (typeof configs)[keyof typeof configs]
			})
		},
		[changeConfigs, handleChangeConfig]
	)

	return (
		<section>
			<header>
				<h1 className="text-3xl">Settings</h1>
			</header>

			<main className="mt-10 space-y-10">
				<SettingRow
					title="General"
					description="Configure how you trigger and interact with the panel."
					childrenClassName="flex flex-row gap-4"
				>
					<div className={twMerge('general-card', generalCardClassName)}>
						<header>
							<IconKeyboard />
							Open emoji panel
						</header>

						<main>
							<button type="button">:</button>
						</main>
						<footer>Pres to remap</footer>
					</div>
				</SettingRow>

				<SettingRow title="Preferences" childrenClassName="space-y-3">
					<SwitchRow
						title="Launch at startup"
						description="Automatically start Fast Emoji when windows starts."
						icon={() => <IconRocket />}
						id="lauch-at-startup"
						name="lauch-at-startup"
						onValueChange={(value) => {
							handleChangeConfig('app', 'launch_at_startup', value)
							changeConfigs({
								key: 'launch_at_startup',
								value
							})
						}}
						value={configs.launch_at_startup}
					/>
					<SwitchRow
						title="Run in background"
						description="Keep the app running in the system tray when closed."
						icon={() => <IconEyeOff />}
						id="run-in-backgroun"
						name="run-in-backgroun"
						onValueChange={(value) => {
							handleChangeConfig('app', 'run_in_background', value)
							changeConfigs({
								key: 'run_in_background',
								value
							})
						}}
						value={configs.run_in_background}
					/>
				</SettingRow>

				<SettingRow title="Appareance">
					<div className="p-6 bg-surface-soft rounded-2xl">
						<header className="flex flex-row gap-4 items-center">
							<div className="bg-primary/30 p-2 rounded size-fit">
								<IconPalette />
							</div>
							<div>
								<h3 className="text-lg">Theme</h3>
								<p className="text-sm text-text-muted leading-tight">
									Select your preferred interface style.
								</p>
							</div>
						</header>

						<main className="mt-5 flex flex-row gap-5">
							{['dark', 'light'].map((t, index) => {
								return (
									<div
										data-theme={t}
										className="w-full p-5 border-2 border-border rounded-3xl text-(--text-primary)"
										// biome-ignore lint/suspicious/noArrayIndexKey: It does not matter
										key={index}
									>
										<div className=" bg-(--background) p-5 rounded-xl">
											<header>
												<h5>{t}</h5>
											</header>

											<main className="mt-3">
												<div className="bg-(--surface) p-3 space-y-2">
													<div className="w-10/12 bg-(--surface-soft) h-3 rounded-3xl"></div>
													<div className="w-6/12 bg-(--surface-soft) h-2 rounded-3xl"></div>
												</div>

												<div className="flex flex-row gap-5 mt-5">
													<div className="w-full h-8 bg-primary rounded cursor-pointer"></div>
													<div className="w-full h-8 bg-(--surface-soft) border border-(--border) rounded cursor-pointer"></div>
												</div>
											</main>
										</div>

										<button
											type="button"
											className="mt-3 w-full bg-(--background) px-4 py-2 rounded-lg flex flex-row items-center justify-between cursor-pointer text-(--text-primary)"
											onClick={() => handleChangeTheme(t)}
										>
											{t}
											<div>
												<InputRadio
													id={`radio-for-theme-${t}`}
													name="theme"
													onValueChange={() => handleChangeTheme(t)}
													value={t}
													currentValue={configs.theme}
												/>
											</div>
										</button>
									</div>
								)
							})}
						</main>
					</div>
				</SettingRow>
			</main>
		</section>
	)
}
