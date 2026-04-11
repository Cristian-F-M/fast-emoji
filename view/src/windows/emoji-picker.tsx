import { IconSearch } from '@tabler/icons-react'
import EMOJIS from 'emojilib'
import {
	useCallback,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState
} from 'react'
import { twMerge } from 'tailwind-merge'
import NoPyWebView from '@/components/NoPyWebView'
import useDebounce from '@/hooks/useDebounce'
import useConfig from '@/states/config'
import type { Configs } from '@/types/config'
import type { Window } from '@/types/emoji-picker'

export function EmojiPicker() {
	const [isPywebviewReady, setIsPywebviewReady] = useState(false)
	const [query, setQuery] = useState('')
	const [focusedEmoji, setFocusedEmoji] = useState<number>(0)
	const debouncedQuery = useDebounce(query, 300)
	const [limit, setLimit] = useState(100)
	const alreadyLoad = useRef(false)
	const loadingMoreMessageRef = useRef(null)
	const iconsListContainerRef = useRef<HTMLElement>(null)
	const emojisEntries = useMemo(() => Object.entries(EMOJIS), [])
	const { configs, load, setConfigs } = useConfig()
	const Window = window as unknown as Window

	const emojis = useMemo(() => {
		if (debouncedQuery) {
			const filteredEntries = emojisEntries.filter(([_, tags]) =>
				tags.some((tag) => tag.includes(debouncedQuery))
			)

			iconsListContainerRef.current?.scrollTo({
				top: 0,
				behavior: 'smooth'
			})
			const emoji = filteredEntries[0]?.[0]
			if (emoji) Window.pywebview.api.set_focused_emoji(emoji)
			return filteredEntries
		}
		const l = Math.min(limit, emojisEntries.length)
		alreadyLoad.current = false
		return emojisEntries.slice(0, l)
	}, [limit, debouncedQuery, emojisEntries])

	const maxIndex = emojis.length - 1
	const minIndex = 0

	const onPywebviewReady = useCallback(() => {
		setIsPywebviewReady(true)
		Window.pywebview.api.log('pywebview is ready in picker')
	}, [])

	const handleEmojiClick = useCallback((emoji: string) => {
		Window.pywebview.api.print_emoji(emoji)
	}, [])

	const getItemSize = useCallback(() => {
		const defaultSize = { width: 0, height: 0, columnGap: 0, rowGap: 0 }

		const $iconsList = document.querySelector(
			'#icons-list'
		) as HTMLElement | null

		if (!$iconsList) return defaultSize

		const item = $iconsList.children.item(0) as HTMLButtonElement | null

		if (!item) return defaultSize

		const iconsListStyle = $iconsList.computedStyleMap()
		const columnGap =
			(iconsListStyle.get('column-gap') as { value: number; unit: string })
				?.value ?? 0
		const rowGap =
			(iconsListStyle.get('row-gap') as { value: number; unit: string })
				?.value ?? 0

		const itemWidth = item.offsetWidth
		const itemHeight = item.offsetHeight
		const width = itemWidth + columnGap
		const height = itemHeight + rowGap

		return { width, height, columnGap, rowGap }
	}, [])

	const getCantItemsPerRow = useCallback(() => {
		const $iconsList = document.querySelector(
			'#icons-list'
		) as HTMLElement | null

		if (!$iconsList) return 0
		const { width, columnGap } = getItemSize()

		return Math.floor(($iconsList.clientWidth + columnGap) / width)
	}, [getItemSize])

	useEffect(() => {
		Window.addEventListener('pywebviewready', onPywebviewReady)
		return () => Window.removeEventListener('pywebviewready', onPywebviewReady)
	}, [onPywebviewReady])

	useEffect(() => {
		if (!isPywebviewReady) return

		const options = {
			rootMargin: '100px',
			threshold: 0.1
		}

		function callback(entries: IntersectionObserverEntry[]) {
			entries.forEach((entry) => {
				if (!entry.isIntersecting || alreadyLoad.current) return
				setLimit((prev) => prev + 100)
				alreadyLoad.current = true
			})
		}

		const observer = new IntersectionObserver(callback, options)

		if (loadingMoreMessageRef.current)
			observer.observe(loadingMoreMessageRef.current)

		return () => observer.disconnect()
	}, [isPywebviewReady])

	useLayoutEffect(() => {
		if (!isPywebviewReady) return
		load()
	}, [load, isPywebviewReady])

	useEffect(() => {
		document.documentElement.setAttribute('data-theme', configs.theme)
	}, [configs])

	Window.setQuery = (query, concat) => {
		if (concat) return setQuery((prev) => prev + query)
		setQuery(query)

		const emoji = emojis?.[0]?.[0]

		if (emoji) Window.pywebview.api.set_focused_emoji(emoji)
		setFocusedEmoji(0)
	}

	Window.changeFocusedEmoji = (index: number) => {
		setFocusedEmoji(index)
		const emoji = emojis[index]?.[0]
		if (emoji) Window.pywebview.api.set_focused_emoji(emoji)
	}

	Window.move_focused_emoji = (direction) => {
		let newFocusedEmoji = focusedEmoji
		const cantItemsPerRow = getCantItemsPerRow()

		if (direction === 'UP') newFocusedEmoji -= cantItemsPerRow
		if (direction === 'DOWN') newFocusedEmoji += cantItemsPerRow
		if (direction === 'LEFT') newFocusedEmoji -= 1
		if (direction === 'RIGHT') newFocusedEmoji += 1

		if (newFocusedEmoji < minIndex || newFocusedEmoji > maxIndex) return
		const emoji = emojis[newFocusedEmoji]?.[0]

		if (emoji) Window.pywebview.api.set_focused_emoji(emoji)
		setFocusedEmoji(newFocusedEmoji)

		const itemsPerRow = getCantItemsPerRow()
		const { height } = getItemSize()

		const y = Math.floor(newFocusedEmoji / itemsPerRow) * height

		iconsListContainerRef.current?.scrollTo({
			top: y,
			behavior: 'smooth'
		})
	}

	Window.change_focused_emoji = (index: number) => {
		if (index < minIndex || index > maxIndex) return
		setFocusedEmoji(index)
	}

	Window.on_hide = () => {
		setQuery('')
		iconsListContainerRef.current?.scrollTo({
			top: 0
		})
		setLimit(100)
	}

	Window.update_configs = (configs: Configs) => {
		setConfigs(configs)
	}

	if (!isPywebviewReady) return <NoPyWebView />

	return (
		<section className="bg-background p-4 h-screen pb-20 backdrop-blur-2xl">
			<header className="w-full sticky top-2 bg-surface/70 backdrop-blur-2xl p-2">
				<input
					type="text"
					value={query}
					className="w-full h-8 border border-border rounded-md px-4 text-text-secondary bg-surface outline-none focus-visible:ring ring-primary placeholder:text-text-muted placeholder:text-sm pl-6 backdrop-blur-2xl"
					placeholder="Search"
					readOnly
				/>
				<div className="absolute top-1/2 -translate-y-1/2 left-4 text-text-muted mt-0.5">
					<IconSearch size={14} />
				</div>
			</header>
			<main
				ref={iconsListContainerRef}
				id="icons-list-container"
				className="h-full p-1 overflow-y-auto overflow-x-hidden mt-4 custom-scroll pr-2"
			>
				<section
					id="icons-list"
					className="grid grid-cols-[repeat(auto-fill,minmax(28px,1fr))] gap-2.5 content-start text-sm"
				>
					{!query && emojis.length === 0 && (
						<h4 className="text-text-secondary text-center col-span-full">
							We could not load the emojis
						</h4>
					)}
					{!!query && emojis.length === 0 && (
						<h4 className="text-text-secondary text-center col-span-full">
							There are not emojis with that name (
							{query.length > 5 ? `${query.slice(0, 5)}...` : query})
						</h4>
					)}
					{emojis.map(([k], index) => (
						<button
							type="button"
							onClick={() => handleEmojiClick(k)}
							className={twMerge(
								'emoji-item text-center p-0.5 rounded bg-surface size-7 hover:bg-surface-soft cursor-pointer outline-none ring-primary hover:ring-2 transition-none! overflow-hidden',
								focusedEmoji === index && 'ring-2'
							)}
							key={k}
						>
							{k}
						</button>
					))}
				</section>
				{emojisEntries.length > emojis.length && (
					<span
						ref={loadingMoreMessageRef}
						id="loading-more-message"
						className={twMerge(
							'block text-text-muted text-center text-sm mt-2 opacity-0 size-0',
							emojis.length > 0 && !debouncedQuery && 'opacity-100 size-auto'
						)}
					>
						Loading more...
					</span>
				)}
			</main>
		</section>
	)
}
