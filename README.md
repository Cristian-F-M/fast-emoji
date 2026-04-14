# Fast Emoji 
`Fast Emoji` es una simple app hecha con python usando webview para el renderizado elegante y moderno de un picker de `emojis`. 


![Fast emoji picker, show a input for emoji search and a grid with emojis ][fast-emoji-gif-preview]

# Instalation
1. Download the [latest](https://github.com/Cristian-F-M/fast-emoji/releases/latest) app setup
2. Execute it.

# How to use
1. In any app you can write `:` and the panel will be displayed.
2. You can continue typing and the emojis will filter according to what you've typed
3. Use the `arrow keys` to select a emoji and then press `Enter` (also you can use your mouse)
4. The emoji will be placed and the query will be deleted

> [!TIP]
> In any moment you can press `Esc` key or `Escape` key to close the panel


# Contributing

> [!WARNING]
> ## Requirements 
> 1. You need `python=3.13`
> 2. Install [uv package manager](https://docs.astral.sh/uv/)
> 3. [bun](https://bun.com/) ([Node.JS](https://nodejs.org/es) or any JavaScript modern runtime) installed


1. Clone repository
```bash
	git clone https://github.com/Cristian-F-M/fast-emoji.git
```
2. Create env with `uv`
```bash
	uv venv
```
3. Install all python dependencies
```bash
	uv sync
```
4. Navigate to `/view/` folder
```bash
	cd view/
```
5. Install frontend dependencies (`React`)
```bash
	bun install
	# npm | yarn | pnpm
```
6. Run the both servers separately
```bash
	# fast-emoji/view/
	bun dev
	# npm | yarn | pnpm


	# fast-emoji/
	uv run main.py
```


## ☕ Support My Work

If you like this app and want to support its development, consider buying me a coffee!

<a href="https://www.buymeacoffee.com/cmorales" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>
															                 


[fast-emoji-gif-preview]: /public/fast-emoji.gif