import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import './global.css'
import { About, HowToUse, Settings } from '@/components/main-view/'
import SideMenu from '@/components/SideMenu'
import { Main } from '@/windows/Main'

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<SideMenu />}>
					<Route index element={<Main />} />
					<Route path="how-to-use" element={<HowToUse />} />
					<Route path="settings" element={<Settings />} />
					<Route path="about" element={<About />} />
				</Route>

				<Route path="*" element={<h1>404 global</h1>} />
			</Routes>
		</BrowserRouter>
	</StrictMode>
)
