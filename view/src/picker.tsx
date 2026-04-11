import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { EmojiPicker } from './windows/emoji-picker'
import './global.css'

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<EmojiPicker />
	</StrictMode>
)
